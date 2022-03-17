yarn upgrade douhub-helper-util --latest
yarn upgrade douhub-ui-store --latest
yarn upgrade douhub-ui-web-basic --latest

chown -R perkhero .
cp -f ./image.d.ts.copy ./node_modules/next/dist/client/image.d.ts