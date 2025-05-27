/* eslint-disable @typescript-eslint/no-require-imports */

// @ts-expect-error Redeclare global
// eslint-disable-next-line @typescript-eslint/no-wrapper-object-types, @typescript-eslint/no-unused-vars
declare const string: String

require('./toRGB')
