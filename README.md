# ConfigurationAdmin
**Moch VueJS 2.6.10 / TypeScript 3.5.3 Admin Site**

**ConfigurationAdmin** is a moch [VueJs 2.6.10](https://vuejs.org/v2/guide/installation.html) / [TypeScript 3.5.3](https://devblogs.microsoft.com/typescript/announcing-typescript-3-5/) site to administer *tech-project* style *configuration files*, using mainly client-side technologies. I created this project to serve as a base framework for getting [VueJS](https://vuejs.org/) and [TypeScript](https://www.typescriptlang.org/) to work together. I also created other custom [TypeScript](https://www.typescriptlang.org/) *[classes](https://www.typescriptlang.org/docs/handbook/classes.html)* such as the *[Str.ts](https://github.com/OhRyanOh/ConfigurationAdmin/blob/master/src/classes/Str.ts)* and *[Obj.ts](https://github.com/OhRyanOh/ConfigurationAdmin/blob/master/src/classes/Obj.ts)* types to help with development of this *SPA ([Single-page Application](https://en.wikipedia.org/wiki/Single-page_application))*. I did follow a great set of tutorials by *[Maximilian Schwarzmuller](https://www.udemy.com/user/maximilian-schwarzmuller/)* along the way titled *[Vue JS 2 - The Complete Guide (incl. Vue Router & Vuex](https://www.udemy.com/vuejs-2-the-complete-guide/#instructor-1)*. As well, I browsed more than 50 other websites, and many [Stack Overflow](https://stackoverflow.com/questions/28150967/typescript-cloning-object) articles, trying to give credit where credit is due. I will focus more on documentation as this grows. From the [Stack Overflow](https://stackoverflow.com/questions/28150967/typescript-cloning-object) link, you can see how I adapted code from their [TypeScript - Cloning Object](https://stackoverflow.com/questions/28150967/typescript-cloning-object) article, when I created the `clone` method in my *[Obj.ts](https://github.com/OhRyanOh/ConfigurationAdmin/blob/master/src/classes/Obj.ts)* class. I did include a link back to the article in the source code for *[Obj.ts](https://github.com/OhRyanOh/ConfigurationAdmin/blob/master/src/classes/Obj.ts)*, and I will try to maintain the documentation as well in the future. A good deal of this site, is custom component code I have written. I strived to break things down properly and went through many redesigns along the way, in learning how to use [VueJS](https://vuejs.org/) and [TypeScript](https://www.typescriptlang.org/), and how to incorporate [Vuex](https://vuex.vuejs.org/) to overcome [VueJS](https://vuejs.org/) isolated scope for all [VueJS Components](https://v1.vuejs.org/guide/components.html).

One thing I did enjoy out of this project was creating *[Str.ts](https://github.com/OhRyanOh/ConfigurationAdmin/blob/master/src/classes/Str.ts)* class. I tried to introduce some **C# .NET** *Style String functionality* into my code base, and have only pulled in what I need for now, for how I normally code with **C# .NET**, and what I use most out of the [.NET String](https://docs.microsoft.com/en-us/dotnet/api/system.string.isnullorwhitespace?view=netframework-4.8) class. For instance the *[Str.ts](https://github.com/OhRyanOh/ConfigurationAdmin/blob/master/src/classes/Str.ts)* class will allow the *implementer* to code as follows in [TypeScript](https://www.typescriptlang.org/):

```typescript
import Str from "./Str";

let value: string;
if (Str.IsNullOrWhiteSpace(value)) {
  value = Str.Empty;
}

value += "Just random text: ";

console.log(`<div>${value}</div>`);
```

In this application so far I am dealing with [Microsoft Word](https://www.microsoft.com/en-us/p/word/cfq7ttc0k7c7?activetab=pivot%3aoverviewtab) and [Microsoft Excel](https://www.microsoft.com/en-au/p/excel-mobile/9wzdncrfjbh3?activetab=pivot:overviewtab) *Copy and Paste* style documents, and I am showing how to drive the application through [Vuex](https://vuex.vuejs.org/) to pre-populate page data to speed up development. Here is the XML that gets generated:

```
<config>
  <rules>
    <rule>
      <startdate>01/01/2023</startdate>
      <enddate>04/01/2023</enddate>
      <routes>
        <route>
          <from>
            <location>Fedex<location>
          </from>
		      <to>
            <location>Target</location>
          </to>
        </route>
      </routes>
    </rule>
  </rules>
</config>

```
