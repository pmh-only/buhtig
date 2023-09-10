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
tig : the ultra-simple `git` clone project.

Subcommands:
        tig auth
        Login registry with id, accesskey.

        tig get <repository_id>
        Create directory and download latest files from registry.

        tig down [commit_id]
        Download latest or specific commit files from registry.  
        Warning! this command will discard all uploaded changes. 

        tig up
        Commit file changes and upload to registry

        tig files
        Calculate file changes.

        tig log
        Show commit histories

        tig help
        Show this messag
```
