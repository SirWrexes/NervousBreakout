interface String {
  /**
   * Returns a copy of s in which all (or the first {@link n}, if given)
   * occurrences of {@link pattern} have been replaced by a replacement string
   * specified by {@link replacement}.
   *
   * The character % works as an escape character: any sequence in repl of the
   * form %n, with n between 1 and 9, stands for the value of the n-th captured
   * substring (see below). The sequence %0 stands for the whole match.
   * The sequence %% stands for a single %.
   *
   * @example
   * const x = 'hello world'.gsub('(%w+)', '%1 %1')
   *   --> x = 'hello hello world world'
   *
   * @example
   * const x = 'hello world'.gsub('%w+', '%0 %0', 1)
   *   --> x = 'hello hello world'
   *
   * @example
   * const x = 'hello world from Lua'.gsub('(%w+)%s*(%w+)', '%2 %1')
   *   --> x = 'world hello Lua from'
   *
   * @see https://www.lua.org/manual/5.1/manual.html#5.4
   */
  gsub(
    this: string,
    pattern: string,
    replacement: srtring,
    n?: number
  ): LuaMultiReturn<[result: string, matches: number]>

  /**
   * Returns a copy of s in which all (or the first {@link n}, if given)
   * occurrences of {@link pattern} have been replaced by a replacement string
   * specified by {@link replacement}.
   *
   * {@link replacement} will be called every time a match occurs, with all
   * captured substrings passed as arguments, in order; if the pattern
   * specifies no captures, then the whole match is passed as a sole argument.
   *
   * @example
   * const x = 'home = $HOME, user = $USER'.gsub('%$(%w+)', os.getenv)
   *   --> x = 'home = /home/roberto, user = roberto'
   *
   * @example
   * const x = '4+5 = $return 4+5$'.gsub('%$(.-)%$', (s: string) => loadstring(s)())
   *   --> x = '4+5 = 9'
   *
   * @see https://www.lua.org/manual/5.1/manual.html#5.4
   */
  gsub(
    this: string,
    pattern: string,
    replacement: (capture: string) => unknown,
    n?: number
  ): LuaMultiReturn<[result: string, matches: number]>

  /**
   * Returns a copy of s in which all (or the first {@link n}, if given)
   * occurrences of {@link pattern} have been replaced by a replacement string
   * specified by {@link replacement}.
   *
   * {@link replacement} will be queried for every match, using the first
   * capture as the key; if the pattern specifies no captures, then the whole
   * match is used as the key.
   *
   * @example
   * const t = { name: 'lua', version: '5.1' }
   * const x = '$name-$version.tar.gz'.gsub('%$(%w+)', t)
   *   --> x = 'lua-5.1.tar.gz'
   *
   * @see https://www.lua.org/manual/5.1/manual.html#5.4
   */
  gsub(
    this: string,
    pattern: string,
    replacement: Record<string, unknown>,
    n?: number
  ): LuaMultiReturn<[result: string, matches: number]>
}
