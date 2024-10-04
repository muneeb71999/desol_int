import { Model, Document, PipelineStage } from 'mongoose'
import { Query } from 'express-serve-static-core'
import { IGetDocumentsResponse } from '@/types'
import { DEFAULT_LIMIT, DEFAULT_PAGE } from '@/constants'

interface IQuery extends Query {}

interface IFieldOperators {
  [field: string]: string[]
}

interface IPopulateOptions {
  path: string
  select?: string
}

interface PropsGetDocuments<T extends Document> {
  model: Model<T>
  query?: IQuery
  select?: string
  fieldOperators?: IFieldOperators
  aggregationPipeline?: PipelineStage[]
  populateOptions?: IPopulateOptions[]
  sort?: string
}

export async function getDocuments<T extends Document>({
  model,
  query = {},
  fieldOperators = {},
  select = '',
  aggregationPipeline = [],
  populateOptions = [],
  sort = ''
}: PropsGetDocuments<T>): Promise<IGetDocumentsResponse<T>> {
  let page: number = DEFAULT_PAGE
  let limit: number = DEFAULT_LIMIT

  if (query.page) {
    page = parseInt(query.page as string)
    delete query.page

    if (page < 1) {
      page = 1
    }
  }

  if (query.limit) {
    limit = parseInt(query.limit as string)
    delete query.limit

    if (limit < 1) {
      limit = 1
    }
  }

  const filteredQuery = Object.keys(query)
    .filter((key) => Object.keys(fieldOperators).includes(key))
    .reduce(
      (obj, key) => {
        let value = query[key]
        const allowedOperators = fieldOperators[key]

        if (typeof value === 'string' && allowedOperators.includes('in')) {
          obj[key] = { $in: value.split(',') }
        } else if (Array.isArray(value)) {
          obj[key] = { $in: value }
        } else if (
          (typeof value === 'object' && value !== null && (value as any).gte) ||
          (typeof value === 'object' &&
            (value as any).lt &&
            allowedOperators.includes('range'))
        ) {
          obj[key] = {}
          if ((value as any).gte) {
            obj[key].$gte = (value as any).gte
          }
          if ((value as any).lt) {
            obj[key].$lt = (value as any).lt
          }
          if ((value as any).lte) {
            obj[key].$lte = (value as any).lte
          }
          if ((value as any).gt) {
            obj[key].$gt = (value as any).gt
          }
        } else if (
          typeof value === 'string' &&
          allowedOperators.includes('regex')
        ) {
          try {
            if (value) {
              value = value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
              const regex = new RegExp(value, 'i');
              obj[key] = regex;
            }
          } catch (e) {
            console.error(`Invalid regex for key ${key}: ${value}`)
          }
        } else if (allowedOperators.includes('exact')) {
          // check if value is not empty
          if (value) obj[key] = value
        }
        return obj
      },
      {} as Record<string, any>
    )

  // make sure filterQuery values are converted to boolean if they are boolean
  Object.keys(filteredQuery).forEach((key) => {
    if (filteredQuery[key] === 'true') {
      filteredQuery[key] = true
    } else if (filteredQuery[key] === 'false') {
      filteredQuery[key] = false
    }
  })

  const aggregation = model.aggregate([
    { $match: filteredQuery },
    ...aggregationPipeline
  ])

  const docsQuery = model
    .find(filteredQuery)
    .select(select)
    .sort(sort)
    .skip((page - 1) * limit)
    .limit(limit)

  populateOptions.forEach((option) => {
    docsQuery.populate(option)
  })

  const docs = await docsQuery.exec()

  let total = await aggregation.count('__v').exec()

  if (total.length === 0) {
    total = [{ __v: 0 }]
  }

  total = total[0].__v

  const totalPages = Math.ceil(Number(total) / Number(limit))

  return {
    docs,
    total: Number(total),
    page,
    limit,
    currentCount: docs.length,
    currentPage: page,
    nextPage: page + 1 > totalPages ? null : page + 1,
    prevPage: page - 1 || null,
    totalPages: totalPages
  }
}
