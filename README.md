# bizDataGrid

bizDataGrid is a javascript component that allows you to show and edit data in a grid in the most simple way possible.It also gives some options to adapt it to the most common scenarios.

## Dependencies
* jQuery

## Installing

Add a reference to bizDataGrid.js and bizDataGrid.css files.

Note: bizDataGrid.js and bizDataGrid.css along with the images folder should be in the same path. Also make sure to include jquery befere including bizDataGrid.js

```javascript
    <link  href="/scripts/BizDataGrid/bizDataGrid.css" rel="stylesheet"  >
    
    <script type="text/javascript" src="/scripts/jquery-1.10.2.min.js" ></script>
    <script type="text/javascript" src="/scripts/BizDataGrid/bizDataGrid.js"></script>

```


## Basic Example

HTML:

```html
<div  id="gridContainer">
   <div is class="bizDataGrid" u-title="mydatagrid"  u-fillspace="true" >

      <bizDataGrid-rowtemplate is u-headerheight="35px" />

      </div>

   </div>
</div>
```

Javascript:

```javascript 
var dataSource = [{column1:"value1",column2:"value2"}];
var grid = new bizDataGrid($("#gridContainer"),{dataSource:dataSource});
```

## Authors

* **Arturo Gamboa Rodriguez** - *Initial work* - [ArturoGamRod](https://github.com/ArturoGamRod)

See also the list of [contributors](https://github.com/ArturoGamRod/bizDataGrid/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) for details
