set -e
sh run-upgrade.sh
rm -rf build
sh run-test.sh
npm publish