/* eslint-disable @typescript-eslint/no-unused-vars */

declare let warning: (typeof io)['stderr']['write']

warning = (...msg) => io.stderr.write('DEBUG: ', ...msg)
