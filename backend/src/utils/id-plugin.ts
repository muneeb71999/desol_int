import { Schema } from 'mongoose'

export function idPlugin(schema: Schema) {
  // Create a virtual id field
  schema.virtual('id').get(function () {
    return (this._id as unknown as { toHexString: () => string }).toHexString()
  })

  // Ensure virtual fields are serialised.
  schema.set('toJSON', {
    virtuals: true,
    versionKey: false
  })
}
