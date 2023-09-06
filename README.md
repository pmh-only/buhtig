# buhtig
the ultra-simple github clone. (for school hw.)

## features.
* Code upload & download.
* Online code viewer & editor
* Version revert.
* Merge repositories (without diff calculation).
* Personal token based session.

### `tig` - cli buhtig client.
```
Login with personal token   -- tig auth
Download source code        -- tig down <registry_domain> <repository_id>
Commit & Upload source code -- tig up <commit_message>
Show commit list            -- tig commits
Revert code to prev. commit -- tig revert <commit_id>
```
