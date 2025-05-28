/* eslint-disable @typescript-eslint/no-require-imports */

// @ts-expect-error Overloeading existing definition of `string`
// eslint-disable-next-line @typescript-eslint/no-wrapper-object-types, @typescript-eslint/no-unused-vars
declare const string: String

require('./toRGB')
require('./joinTemplate')
