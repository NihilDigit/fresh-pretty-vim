function fe --description 'Open Fresh editor, creating missing local files first'
    if test "$FE_CREATE_MISSING" = 0
        command fresh $argv
        return $status
    end

    if contains -- --cmd $argv
        command fresh $argv
        return $status
    end

    set -l passthrough 0
    set -l skip_next 0

    for arg in $argv
        if test $skip_next -eq 1
            set skip_next 0
            continue
        end

        if test $passthrough -eq 0
            switch $arg
                case --
                    set passthrough 1
                    continue
                case --config --log-file --event-log --locale -a --attach
                    set skip_next 1
                    continue
                case '--config=*' '--log-file=*' '--event-log=*' '--locale=*' '--attach=*'
                    continue
                case '-*'
                    continue
            end
        end

        if test "$arg" = -
            continue
        end

        if string match -q '*://*' -- $arg
            continue
        end

        # Skip scp-style remote paths such as user@host:path.
        if string match -qr '^[^/[:space:]]+@[^/[:space:]]+:.+' -- $arg
            continue
        end

        # Fresh accepts file:line:col and file:range@"message". Create the file
        # part before handing the original argument to Fresh.
        set -l parts (string split -m1 '@' -- $arg)
        set -l spec $parts[1]
        set -l path (string replace -r '^(.+):[0-9]+(:[0-9]+)?(-[0-9]+(:[0-9]+)?)?$' '$1' -- $spec)

        if test -z "$path"
            continue
        end

        if not test -e "$path"
            mkdir -p (dirname -- "$path")
            touch -- "$path"
        end
    end

    command fresh $argv
end
