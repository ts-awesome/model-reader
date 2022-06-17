# @ts-awesome/model-reader

Typescript contracts and json to model reader

Key features:

* ensure correct native types
* support for convertor
* support for reader methods
* support for auto type detection

## Model declaration

Simple way to make model readable is to decorate properties with `@readable` 

```ts
import {readble} from '@ts-awesome/model-reader'

class SomeModel {
  @readable
  public a!: number;
  
  // @readable can try and guess type if it available in runtime 
  // or report and error
  // supported: string, number, boolean, Date, any readable model
  @readable
  public b!: string;

  // if property is optional, it needs explicit type declaration
  @readable(String, true)
  public c?: string;
  
  // if property is nullable, it needs explicit type declaration
  @readable(String, true)
  public d!: string | null;
  
  // recursive references also work
  @readable(SomeModel, true)
  public e!: SomeModel | null;
  
  // and arrays
  @readable([SomeModel])
  public f!: SomeModel[];
  
  // and optional arrays
  @readable([SomeModel], true)
  public g?: SomeModel[] | null;
}
```

For advanced use cases class can provide a reader function 

```ts
class SomeModel {
  static [ReaderSymbol](raw: unknown): SomeModel {
    // you have all the freedome and reader as a help
    return new SomeModel();
  }
}
```

## Model read

```ts
import reader from '@ts-awesome/model-reader';

const source = {
  a: 1,
  b: 'some',
  d: null,
  e: null,
  f: [],
  g: null,
}

const model = reader(source, SomeModel);
const array = reader([source, source], [SomeModel]);

model instanceof SomeModel // yes
array[0] instanceof SomeModel // yes
```

## Why do we event need this ?

### Short answer: 

Because JavaScript/JSON is non-typed dynamic language.

### Long answer:

There are cases when app obtains data from external sources (eg api, json files).
App has not control over that data structure and can only hope that data has correct 
types. 

Common practice is to create interfaces for such external data, so  TypeScript can 
do static verifications. But interface in this case is only an assumption.

As an illustration:

* Developer gets specs and writes following code:

```ts
interface ExternalData {
  name: string;
  value: number;
  date: Date;
}

function process(data: ExternalData) {
  console.log(data.name.trim());
  console.log(data.value + 10);
  console.log(data.date.toDateString());
}
```

* Sometime later api developer changes response format:

    * if `name` can be `string|number|undefined` then app will crash from time to time
    * if `value` can be `string|number` then app will produce weird results
    * if `date` becomes ISO string app will crash with `toDateString` is not a function

Processing this data with model reader as soon as possible will help to detect such problems 
early, and so it is easier to identify the issue 


# License
May be freely distributed under the [MIT license](https://opensource.org/licenses/MIT).

Copyright (c) 2022 Volodymyr Iatsyshyn and other contributors
