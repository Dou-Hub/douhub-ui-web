set -e
npm version patch --no-git-tag-version
sh run-upgrade.sh
sh run-publish.sh