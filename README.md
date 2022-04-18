# douhub-ui-web

if run into error below, 

Cannot find name 'StaticImageData'
declare type StaticImport = StaticRequire | StaticImageData;

manually add the code below into the corresponding file

```js
type StaticImageData = {
    src: string;
    height: number;
    width: number;
    placeholder?: string;
  };
```

if run into the error below, make sure correct typscript version
Overload signatures must all be optional or required.
203     randomUUID?(): string

sudo yarn add typescript@4.5.5 --dev


## get to the folder from root
sudo -i
cd /users/perkhero/projects/douhub