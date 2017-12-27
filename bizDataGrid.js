///Created By:Arturo Gamboa
///e-mail: Arturogamrod@gmail.com
 (function (bizDataGrid, $) {


    window.bizDataGrid = function (container, options) {


        var $bizDataGrid;
        var $template;
        var $body;
        var $header;
        var $pager;
        var _paginationSize = 20;
        var _currentPage;
        var $container;
        var _canUserAdd = true;
        var _canUserRemove = true;
        var _dataSource = [];
        var _lockSelectedRow = false;
        var _gridMode = "";
        var that = this;
        var _removedRows = [];
        var _lastMaxWidths = [];
        var _userDefinedTotalPages = null;
        var _totalPages = null;
        var _currentFilter = null;
        var _canInteract = true;
        var _errors = [];
        var _canValidate = true;
        var _canPaginate = true;
        var _canFilterAndSort = true;
        var _lastFilter = null;
        var _originalDataSource = null;


        var _showRowNumber = true;

        this.onDataSourceChanged = null;




        this.header = function () {

            return $header.get(0);
        }

        this.body = function () {

            return $body.get(0);
        }

        this.canPaginate = function (boolean) {

            _canPaginate = boolean;

        };


        this.undoAll = function () {
            that.dataSource(_originalDataSource);
        }


        this.readOnly = function (boolean) {

            if (typeof (boolean) == "undefined") {
                return _options.readOnly;
            }

            else {
                _options.readOnly = boolean;

                if (boolean == true) {
                    $body.find("input").attr("disabled", "disabled");
                }

                if (boolean == false) {
                    $body.find("input").removeAttr("disabled");
                }
            }


            $body.find(".textInput , .textInputError").each(function (index, value) {

                if ($(value).attr("disabled")) {
                    $(value).siblings(".fakeInput").removeAttr("contenteditable");
                    $(value).siblings(".fakeInput").css("background-color", "rgb(210,210,210)");
                }
                else {
                    $(value).siblings(".fakeInput").attr("contenteditable", "true");
                    $(value).siblings(".fakeInput").css("background-color", "inherit");

                }
            });



        }

        this.canFilterAndSort = function (boolean) {

            if (typeof (boolean) == "undefined") {
                return _canFilterAndSort;
            }

            else {
                _canFilterAndSort = boolean;

                if (boolean == false) {
                    $header.find(".u-upArrow").hide();
                    $header.find(".u-downArrow").hide();
                    $header.find(".u-cancelFilter").hide();
                }
                else {
                    $header.find(".u-upArrow").show();
                    $header.find(".u-downArrow").show();
                }
            }

        };

        this.disabledRecalc = false;


        function tableToExcel(table, name, filename) {

            var uri = 'data:application/vnd.ms-excel;base64,'
        , template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--><meta http-equiv="content-type" content="text/plain; charset=UTF-8"/></head><body><table>{table}</table></body></html>'
        , base64 = function (s) { return window.btoa(unescape(encodeURIComponent(s))) }
        , format = function (s, c) { return s.replace(/{(\w+)}/g, function (m, p) { return c[p]; }) }


            var tableToExport = getTableToExport();
            var ctx = { worksheet: name || 'Worksheet', table: $tableTemp.get(0).innerHTML }

            var tempLink = $("<a/ id='u_dLink'>");
            tempLink.attr("href", uri + base64(format(template, ctx)));
            tempLink.attr("download", filename);

            $("body").append(tempLink);
            $("body").find("#u_dLink").get(0).click();
            $("body").find("#u_dLink").remove();


        }

        this.getCurrentFilter = function () {

            return _currentFilter;
        };

        this.filter = function (options) {




            if (typeof (options) != "object") {
                console.log("BizGrid: debe ingresar parametros validos");
                return;
            }


         
            _currentFilter = options;

            if (!$bizDataGrid.attr("u-filterhandler")) {
                filter(_currentFilter);
                return;
            }

            if (typeof (window[$bizDataGrid.attr("u-filterhandler")]) != "function") {
                console.log("BizGrid: No ha establecido una funcion de filtro");
                return;
            }


            if (_currentFilter.filterValue == null) {
                $(".u-cancelFilter").hide();
            }


            window[$bizDataGrid.attr("u-filterhandler")](_currentFilter);
          
        };
        //function getTableToExport() {

        //    var $tableTemp = $("<table/>");

        //    var table = $body.get(0);
        //    var columnsCount = $(table.rows[0]).find("td").length;


        //    for (var index = -1; index < table.rows.length; index++) {

        //        var $row = $("<tr/>")

        //        for (var index2 = 0; index2 < columnsCount; index2++) {

        //            if (_showRowNumber == true && index2 == 0) {
        //                continue;
        //            }


        //            var $column = $("<td/>").css("border", "1px solid black");


        //            if (index == -1)
        //                $column.css("background-color", "rgb(255,139,139)");
        //            else
        //                $column.css("background-color", "rgb(255,201,201)");


        //            if (index == -1) {

        //                $column.text($($(table).parents(".BizDataGrid").find(".BizDataGridHeader").get(0).rows[0]).find("td").eq(index2).find(".u-headerText").eq(0).text());
        //                $column.css("font-weight", "bold")
        //            }
        //            else {
        //                $column.text($(table.rows[index]).find("td").eq(index2).find("[u-datafieldname]").eq(0).val());

        //            }
        //            $row.append($column);


        //        }

        //        $tableTemp.append($row);
        //    }

        //    return $tableTemp.get(0);

        //}



        //function getTableToExport() {

        //    var $tableTemp = $("<table/>");

        //    var table = $body.get(0);
        //    var columnsCount = $(table.rows[0]).find("td").length;
        //    var datos = _dataSource;

        //    for (var index = -1; index < datos.length; index++) {

        //        var $row = $("<tr/>")
        //        $row.css("height", "17px");

        //        for (var index2 = 0; index2 < columnsCount; index2++) {

        //            if (_showRowNumber == true && index2 == 0) {
        //                continue;
        //            }



        //            var $column = $("<td/>").css("border", "1px solid black");
        //            $column.css("width", $header.find("td").eq(index2).width() + "px");
        //            $column.css("height", "17px");


        //            if (index == -1)
        //                $column.css("background-color", "rgb(255,139,139)");
        //            else
        //                $column.css("background-color", "rgb(255,201,201)");


        //            if (index == -1) {
        //                $column.text($($(table).parents(".BizDataGrid").find(".BizDataGridHeader").get(0).rows[0]).find("td").eq(index2).find(".u-headerText").eq(0).text());
        //                $column.css("font-weight", "bold");
        //            }
        //            else {


        //                $column.css("text-align", "left");
        //                //   $column.text($(table.rows[index]).find("td").eq(index2).find("[u-datafieldname]").eq(0).val());

        //                //if ($template.find("BizDataGrid-ColumnTemplate").eq(index2).find("[u-datafieldpath]").attr("u-datafieldpath"))
        //                //    $column.text(datos[index][$template.find("BizDataGrid-ColumnTemplate").eq(index2).find("[u-datafieldname]").eq(0).attr("u-datafieldname")][$template.find("BizDataGrid-ColumnTemplate").eq(index2).find("[u-datafieldpath]").attr("u-datafieldpath")]);
        //                //    else
        //                //    $column.text(datos[index][$template.find("BizDataGrid-ColumnTemplate").eq(index2).find("[u-datafieldname]").eq(0).attr("u-datafieldname")]);

        //                var value = "";
        //                var fieldValue = datos[index][$template.find("BizDataGrid-ColumnTemplate").eq(index2).find("[u-datafieldname]").eq(0).attr("u-datafieldname")];
        //                var $control = $template.find("BizDataGrid-ColumnTemplate").eq(index2).find("[u-datafieldname]").clone();
        //                var object = datos[index];
        //                var fieldName = $control.attr("u-datafieldname");
        //                $control.attr("value", fieldValue);
        //                $control.val(fieldValue);


        //                if ($control.attr("u-datasource") && $control.attr("u-datasource").indexOf("this") != -1) {


        //                    var dataSource = object[$control.attr("u-dataSource").split("this.")[1]];
        //                    if (dataSource instanceof Array) {

        //                        for (var x = 0; x < dataSource.length; x++)
        //                            if (dataSource[x].value == object[fieldName]) {
        //                                $control.val(dataSource[x].description);
        //                                fieldValue = dataSource[x].description;
        //                            }
        //                    }

        //                }

        //                else {


        //                    var dataSource = window[$control.attr("u-datasource")];
        //                    if (dataSource instanceof Array) {

        //                        for (var x = 0; x < dataSource.length; x++)
        //                            if (dataSource[x].value == object[fieldName]) {
        //                                $control.val(dataSource[x].description);
        //                                fieldValue = dataSource[x].description;
        //                            }

        //                    }


        //                }



        //                if ($template.find("BizDataGrid-ColumnTemplate").eq(index2).find("[u-datafieldpath]").get(0) && typeof (datos[index][$template.find("BizDataGrid-ColumnTemplate").eq(index2).find("[u-datafieldname]").eq(0).attr("u-datafieldname")]) == "object") {
        //                    if (datos[index][$template.find("BizDataGrid-ColumnTemplate").eq(index2).find("[u-datafieldname]").eq(0).attr("u-datafieldname")] != null)
        //                        if ($template.find("BizDataGrid-ColumnTemplate").eq(index2).find("[u-datafieldpath]").attr("u-datafieldpath").indexOf("()") != -1) {
        //                            if ($template.find("BizDataGrid-ColumnTemplate").eq(index2).find("[u-datafieldpath]").attr("u-datafieldpath").substr(0, $control.attr("u-datafieldpath").length - 2) in datos[index][$template.find("BizDataGrid-ColumnTemplate").eq(index2).find("[u-datafieldname]").eq(0).attr("u-datafieldname")])


        //                                var converterHandler = window[$control.attr("u-valueconverterhandler")];
        //                            if (typeof (converterHandler) != "undefined") {

        //                                if (typeof (converterHandler) == "function") {


        //                                    var val = fieldValue[$control.attr("u-datafieldpath").substr(0, $control.attr("u-datafieldpath").length - 2)]();
        //                                    var args = { value: val, valueToShow: val, lastValue: null, lastValueToShow: null, objectData: _dataSource }
        //                                    converterHandler($control.get(0), args);
        //                                    value = args.valueToShow;
        //                                    //$control.get(0).lastValue = args.value;
        //                                    //$control.get(0).lastValueToShow = args.valueToShow;

        //                                    // var data = $control.parents("tr").dataSource;
        //                                    //dataSource[$control.attr("u-datafieldname")] = args.value;
        //                                    //$control.attr("value", args.value);
        //                                    //$control.val(args.valueToShow);


        //                                }
        //                            }

        //                            else {


        //                                value = fieldValue[$control.attr("u-datafieldpath").substr(0, $control.attr("u-datafieldpath").length - 2)]();

        //                                //$(this).parents("tr").get(0).dataSource[$(this).attr("u-datafieldname")] 
        //                            }

        //                            //$control.attr("value", fieldValue[$control.attr("u-datafieldpath").substr(0, $control.attr("u-datafieldpath").length - 2)]());
        //                            //$control.val(fieldValue[$control.attr("u-datafieldpath").substr(0, $control.attr("u-datafieldpath").length - 2)]());
        //                            //$control.change();

        //                        }
        //                        else {
        //                            if ($control.attr("u-datafieldpath") in fieldValue) {


        //                                var converterHandler = window[$control.attr("u-valueconverterhandler")];
        //                                if (typeof (converterHandler) != "undefined") {

        //                                    if (typeof (converterHandler) == "function") {

        //                                        var val = fieldValue[$control.attr("u-datafieldpath")];
        //                                        var args = { value: val, valueToShow: val, lastValue: null, lastValueToShow: null, objectData: _dataSource }
        //                                        converterHandler($control.get(0), args);
        //                                        value = args.valueToShow;

        //                                        // var data = $control.parents("tr").dataSource;
        //                                        //dataSource[$control.attr("u-datafieldname")] = args.value;
        //                                        value = args.valueToShow;

        //                                    }
        //                                }

        //                                else {

        //                                    $control.attr("value", fieldValue[$control.attr("u-datafieldpath")]);
        //                                    value = fieldValue[$control.attr("u-datafieldpath")];
        //                                }

        //                            }
        //                        }


        //                }


        //                else {


        //                    var converterHandler = window[$control.attr("u-valueconverterhandler")];
        //                    if (typeof (converterHandler) != "undefined") {

        //                        if (typeof (converterHandler) == "function") {


        //                            var args = { value: fieldValue, valueToShow: fieldValue, lastValue: null, lastValueToShow: null, objectData: _dataSource }
        //                            converterHandler($control.get(0), args);
        //                            value = args.valueToShow;
        //                        }
        //                    }

        //                    else {


        //                        value = fieldValue;

        //                    }


        //                }


        //                if (value == null)
        //                    value = "";

        //            }


        //            $column.text(value);
        //            $row.append($column);


        //        }

        //        $tableTemp.append($row);
        //    }

        //    return $tableTemp.get(0);

        //}

        this.getDataPresentation = function (fromSource) {

            var $tableTemp = $("<table/>");

            var table = $body.get(0);
            var columnsCount = $(table.rows[0]).find("td").length;
            var datos = _dataSource;
            var dataPresentacion = [];

            if (typeof (fromSource) != "undefined") {
                datos = fromSource;
            }

            for (var index = 0 ; index < datos.length; index++) {

                var dataPresentacionItem = {};
                dataPresentacion.push(dataPresentacionItem);

                for (var index2 = 0; index2 < columnsCount; index2++) {



                    var value = "";
                    var fieldValue = datos[index][$template.find("BizDataGrid-ColumnTemplate").eq(index2).find("[u-datafieldname]").eq(0).attr("u-datafieldname")];
                    var $control = $template.find("BizDataGrid-ColumnTemplate").eq(index2).find("[u-datafieldname]").clone();
                    var object = datos[index];
                    var fieldName = $control.attr("u-datafieldname");
                    $control.attr("value", fieldValue);
                    $control.val(fieldValue);


                    if ($control.attr("u-datasource") && $control.attr("u-datasource").indexOf("this") != -1) {


                        var dataSource = object[$control.attr("u-dataSource").split("this.")[1]];
                        if (dataSource instanceof Array) {

                            for (var x = 0; x < dataSource.length; x++)
                                if (dataSource[x].value == object[fieldName]) {
                                    $control.val(dataSource[x].description);
                                    fieldValue = dataSource[x].description;
                                }
                        }

                    }

                    else {


                        var dataSource = window[$control.attr("u-datasource")];
                        if (dataSource instanceof Array) {

                            for (var x = 0; x < dataSource.length; x++)
                                if (dataSource[x].value == object[fieldName]) {
                                    $control.val(dataSource[x].description);
                                    fieldValue = dataSource[x].description;
                                }

                        }


                    }



                    if ($template.find("BizDataGrid-ColumnTemplate").eq(index2).find("[u-datafieldpath]").get(0) && typeof (datos[index][$template.find("BizDataGrid-ColumnTemplate").eq(index2).find("[u-datafieldname]").eq(0).attr("u-datafieldname")]) == "object") {
                        if (datos[index][$template.find("BizDataGrid-ColumnTemplate").eq(index2).find("[u-datafieldname]").eq(0).attr("u-datafieldname")] != null)
                            if ($template.find("BizDataGrid-ColumnTemplate").eq(index2).find("[u-datafieldpath]").attr("u-datafieldpath").indexOf("()") != -1) {
                                if ($template.find("BizDataGrid-ColumnTemplate").eq(index2).find("[u-datafieldpath]").attr("u-datafieldpath").substr(0, $control.attr("u-datafieldpath").length - 2) in datos[index][$template.find("BizDataGrid-ColumnTemplate").eq(index2).find("[u-datafieldname]").eq(0).attr("u-datafieldname")])


                                    var converterHandler = window[$control.attr("u-valueconverterhandler")];
                                if (typeof (converterHandler) != "undefined") {

                                    if (typeof (converterHandler) == "function") {


                                        var val = fieldValue[$control.attr("u-datafieldpath").substr(0, $control.attr("u-datafieldpath").length - 2)]();
                                        var args = { value: val, valueToShow: val, lastValue: null, lastValueToShow: null, objectData: _dataSource }
                                        converterHandler($control.get(0), args);
                                        value = args.valueToShow;
                                        //$control.get(0).lastValue = args.value;
                                        //$control.get(0).lastValueToShow = args.valueToShow;

                                        // var data = $control.parents("tr").dataSource;
                                        //dataSource[$control.attr("u-datafieldname")] = args.value;
                                        //$control.attr("value", args.value);
                                        //$control.val(args.valueToShow);


                                    }
                                }

                                else {


                                    value = fieldValue[$control.attr("u-datafieldpath").substr(0, $control.attr("u-datafieldpath").length - 2)]();

                                    //$(this).parents("tr").get(0).dataSource[$(this).attr("u-datafieldname")] 
                                }

                                //$control.attr("value", fieldValue[$control.attr("u-datafieldpath").substr(0, $control.attr("u-datafieldpath").length - 2)]());
                                //$control.val(fieldValue[$control.attr("u-datafieldpath").substr(0, $control.attr("u-datafieldpath").length - 2)]());
                                //$control.change();

                            }
                            else {
                                if ($control.attr("u-datafieldpath") in fieldValue) {


                                    var converterHandler = window[$control.attr("u-valueconverterhandler")];
                                    if (typeof (converterHandler) != "undefined") {

                                        if (typeof (converterHandler) == "function") {

                                            var val = fieldValue[$control.attr("u-datafieldpath")];
                                            var args = { value: val, valueToShow: val, lastValue: null, lastValueToShow: null, objectData: _dataSource }
                                            converterHandler($control.get(0), args);
                                            value = args.valueToShow;

                                            // var data = $control.parents("tr").dataSource;
                                            //dataSource[$control.attr("u-datafieldname")] = args.value;
                                            value = args.valueToShow;

                                        }
                                    }

                                    else {

                                        $control.attr("value", fieldValue[$control.attr("u-datafieldpath")]);
                                        value = fieldValue[$control.attr("u-datafieldpath")];
                                    }

                                }
                            }


                    }


                    else {


                        var converterHandler = window[$control.attr("u-valueconverterhandler")];
                        if (typeof (converterHandler) != "undefined") {

                            if (typeof (converterHandler) == "function") {


                                var args = { value: fieldValue, valueToShow: fieldValue, lastValue: null, lastValueToShow: null, objectData: _dataSource }
                                converterHandler($control.get(0), args);
                                value = args.valueToShow;
                            }
                        }

                        else {


                            value = fieldValue;

                        }


                    }


                    if (value == null)
                        value = "";

                    dataPresentacionItem[$template.find("BizDataGrid-ColumnTemplate").eq(index2).attr("u-headername") || fieldName] = value;

                }


            }

            return dataPresentacion;

        }


        var _options = {

            maxHeight: null,
            removeRowOnDelKeyPress: false,
            columns: {},
            $controlOnEnterKeypress: false,
            fitColumnToContents: true

        }

        this.setColumns = function (columns) {

            _options.columns = columns;
            that.dataSource(_dataSource);


        };

        this.excelFileName = "File.xls";
        this.canValidate = function (value) {

            if (typeof (value) == "undefined") {

                return _canValidate;

            }

            else {

                _canValidate = value;

            }

        }


        this.rowsInError = function () {

            var count = 0;

            for (var x = 0; x < _dataSource.length; x++) {
                if (_dataSource[x].error)
                    count++;
            }

            return count;

        }

        this.isValid = function () {

            $body.find("input").each(function (index, value) {

                value.__hasError = false;
                if ($(value).attr("type") != "checkbox")
                    $(value).removeClass("textInputError").addClass("textInput");
                $(value.errorContainer).remove();
                $(value).off("mouseenter");
                $(value).off("mouseout");

            });

            $body.find(".u-rowinerror").removeClass("u-rowinerror");
            //target.__hasError = false;
            //$(target).removeClass("textInputError").addClass("textInput");
            //$(target.errorContainer).remove();
            //target.errorContainer = undefined;
            //$(target).off("mouseenter");
            //$(target).off("mouseout");

            _errors = [];
            $body.find(".textInputError").removeClass("textInputError");

            var inputs = $body.find("[u-validators]");

            for (var x = 0; x < inputs.length; x++) {

                inputs[x].__hasError = false;
            }

            for (var x = 0; x < _dataSource.length; x++) {

                if (_dataSource[x].error) {
                    $(that.getRow(_dataSource[x])).addClass("u-rowinerror");
                }
            }

            validateGrid();
            return !(_errors.length > 0);

        };


        this.onRegistersChanged = null;
        this.onRegistersChanging = null;


        this.totalPages = function (count) {

            if (typeof (count) == "undefined") {

                if (_userDefinedTotalPages == null)
                    return _totalPages;
                else
                    return _userDefinedTotalPages;


            }

            else {
                _userDefinedTotalPages = count;
                if (IsNumeric(count))
                    $pager.find(".u-endButton").show();
            }

        }

        var _totalItems = 0;
        this.totalItems = function () {

            return _totalItems;

        }

        this.pageSize = function () {

            return _paginationSize;
        }


        this.currentPage = function () {

            return _currentPage;

        }


        this.lockSelectedRow = function (boolean) {

            if (typeof (boolean) == "undefined") {

                return _lockSelectedRow;
            }

            else {

                _lockSelectedRow = boolean;

                if (_lockSelectedRow == true) {

                    $body.find("tr:not('.activeRow')").find("input").attr("disabled", "disabled");
                }

                else {
                    $body.find("input").removeAttr("disabled");
                }

            }

        }

        this.getRow = function (data) {


            for (var i in $body.get(0).rows) {

                if ($body.get(0).rows[i].dataSource == data)
                    return $body.get(0).rows[i];
            }

            return null;

        }

        this.getAllRows = function (data) {

            return $body.get(0).rows;
        }

        this.canAdd = function (boolean) {

            if (typeof (boolean) == "undefined") {

                return _canUserAdd;
            }

            else {

                _canUserAdd = boolean;

            }

        }

        this.canRemove = function (boolean) {
            if (typeof (boolean) == "undefined") {

                return _canUserRemove;
            }

            else {

                _canUserRemove = boolean;

            }

        }


        function onRowKeyUp(e) {


            // var code = "";
            // if (typeof (e) != "undefined")
            code = e.keyCode || e.which;

            if (code == 13 && _options.addRowOnEnterKeypress == true) {

                that.addRow();
            }

            if (code == 46 && _options.removeRowOnDelKeyPress == true) {
                that.removeRow();
            }
        }


        function toObjectsWithAccesors(objects) {

            var newObjects = [];

            for (var i in objects) {

                if ("onPropertyChanged" in objects[i]) {
                    newObjects.push(objects[i]);
                    continue;
                }

                var newObj = {};

                for (var prop in objects[i]) {


                    Object.defineProperty(newObj, "_" + prop, {
                        value: objects[i][prop], configurable: true, writable: true
                    });

                    Object.defineProperty(newObj, "onPropertyChanged", {
                        configurable: true,
                        writable: true,
                        value: null
                    });


                    newObj.onPropertyChanged = updateControlData;
                    var getter = eval("(function () { return  this['_" + prop + "']; })");
                    var setter = eval("(function ( value ) { if(window.candebug)debugger; \nif(value != this['_" + prop + "'] && this._state == 'unmodified'){\n this._state = 'modified';}\nthis['_" + prop + "'] = value;\nthis.onPropertyChanged('" + prop + "',value,this); })");



                    Object.defineProperty(newObj, prop, {
                        enumerable: true,
                        get: getter,
                        set: setter
                    });



                }


                $template.find("[u-datafieldname]").each(function (index, value) {

                    if (!($(value).attr("u-datafieldname") in objects[i])) {

                        var getter = eval("(function () { return  this['_" + $(value).attr("u-datafieldname") + "']; })");
                        var setter = eval("(function ( value ) { if(window.candebug)debugger; \nif(value != this['_" + $(value).attr("u-datafieldname") + "'] && this._state == 'unmodified'){\nthis._state = 'modified';}\nthis['_" + $(value).attr("u-datafieldname") + "'] = value;\nthis.onPropertyChanged('" + $(value).attr("u-datafieldname") + "',value,this); })");

                        Object.defineProperty(newObj, $(value).attr("u-datafieldname"), {
                            enumerable: true,
                            get: getter,
                            set: setter
                        });
                    }

                });

                newObjects.push(newObj)
            }

            return newObjects;
        }

        function updateControlData(fieldName, fieldValue, object) {

            var row = that.getRow(object);
            if (row) {

                //var fieldValue = object[fieldName];
                var $control = $(row).find("[u-datafieldname='" + fieldName + "']");
                if ($control.length == 0)
                    return;

                var description = "";
                //$controls.change();

                if (object.error) {
                    $(row).addClass("u-rowinerror");
                }

                else {
                    $(row).removeClass("u-rowinerror");
                }

                if (!$control.get(0))
                    return;

                if ($control.get(0).type == "checkbox") {

                                        if($control.attr("u-truevalue")){

                            if(fieldValue == $control.attr("u-truevalue"))
                                  $control.get(0).checked =  true;
                            else
                                  $control.get(0).checked =  false;

                             fieldValue =    $control.get(0).checked  ? $control.attr("u-truevalue") : $control.attr("u-falsevalue");
                        }

                        else{

                              $control.get(0).checked = fieldValue;
                        }
                }



                if ($control.val().trim() == "") {
                    if ($control.attr("u-datasource") && $control.attr("u-datasource").indexOf("this") != -1) {


                        var dataSource = object[$control.attr("u-dataSource").split("this.")[1]];
                        if (dataSource instanceof Array) {

                            for (var x = 0; x < dataSource.length; x++)
                                if (dataSource[x].value == object[fieldName]) {
                                    $control.val(dataSource[x].description);
                                    fieldValue = dataSource[x].value;
                                }
                        }

                    }

                    else {


                        var dataSource = window[$control.attr("u-datasource")];
                        if (dataSource instanceof Array) {

                            for (var x = 0; x < dataSource.length; x++)
                                if (dataSource[x].value == object[fieldName]) {
                                    $control.val(dataSource[x].description);
                                    $control.attr("value", dataSource[x].value);

                                }

                        }



                    }

                }


                if (typeof ($control.attr("u-datafieldpath")) != "undefined" && typeof (fieldValue) == "object") {
                    if (fieldValue != null)
                        if ($control.attr("u-datafieldpath").indexOf("()") != -1) {
                            if ($control.attr("u-datafieldpath").substr(0, $control.attr("u-datafieldpath").length - 2) in fieldValue)





                                var converterHandler = window[$control.attr("u-valueconverterhandler")];
                            if (typeof (converterHandler) != "undefined") {

                                if (typeof (converterHandler) == "function") {


                                    var val = fieldValue[$control.attr("u-datafieldpath").substr(0, $control.attr("u-datafieldpath").length - 2)]();
                                    var args = { value: val, valueToShow: val, lastValue: $control.get(0).lastValue, lastValueToShow: $control.get(0).lastValueToShow, objectData: $control.parents("tr").get(0).dataSource }
                                    converterHandler($control.get(0), args);
                                    $control.get(0).lastValue = args.value;
                                    $control.get(0).lastValueToShow = args.valueToShow;

                                    // var data = $control.parents("tr").dataSource;
                                    //dataSource[$control.attr("u-datafieldname")] = args.value;
                                    $control.attr("value", args.value);
                                    $control.val(args.valueToShow);


                                }
                            }

                            else {

                                $control.attr("value", fieldValue[$control.attr("u-datafieldpath").substr(0, $control.attr("u-datafieldpath").length - 2)]());
                                //$(this).parents("tr").get(0).dataSource[$(this).attr("u-datafieldname")] 
                            }

                            //$control.attr("value", fieldValue[$control.attr("u-datafieldpath").substr(0, $control.attr("u-datafieldpath").length - 2)]());
                            //$control.val(fieldValue[$control.attr("u-datafieldpath").substr(0, $control.attr("u-datafieldpath").length - 2)]());
                            //$control.change();

                        }
                        else {
                            if ($control.attr("u-datafieldpath") in fieldValue) {


                                var converterHandler = window[$control.attr("u-valueconverterhandler")];
                                if (typeof (converterHandler) != "undefined") {

                                    if (typeof (converterHandler) == "function") {

                                        var val = fieldValue[$control.attr("u-datafieldpath")];

                                        var args = { value: val, valueToShow: val, lastValue: $control.get(0).lastValue, lastValueToShow: $control.get(0).lastValueToShow, objectData: $control.parents("tr").get(0).dataSource }
                                        converterHandler($control.get(0), args);
                                        $control.get(0).lastValue = args.value;
                                        $control.get(0).lastValueToShow = args.valueToShow;

                                        // var data = $control.parents("tr").dataSource;
                                        //dataSource[$control.attr("u-datafieldname")] = args.value;
                                        $control.attr("value", args.value);

                                        if (object["_" + fieldName] != args.value && object.state == "unmodified")
                                            object.state = "modified";


                                        object["_" + fieldName][$control.attr("u-datafieldpath")] = args.value;

                                    }
                                }

                                else {

                                    $control.attr("value", fieldValue[$control.attr("u-datafieldpath")]);


                                    if (object["_" + fieldName] != fieldValue && object.state == "unmodified")
                                        object.state = "modified";

                                    object["_" + fieldName][$control.attr("u-datafieldpath")] = fieldValue;
                                    //$(this).parents("tr").get(0).dataSource[$(this).attr("u-datafieldname")] 
                                }

                                //$control.attr("value", fieldValue[$control.attr("u-datafieldpath")]);
                                //$control.val(fieldValue[$control.attr("u-datafieldpath")]);
                                //$control.change();
                            }
                        }


                }

                else {



                    var converterHandler = window[$control.attr("u-valueconverterhandler")];
                    if (typeof (converterHandler) != "undefined") {

                        if (typeof (converterHandler) == "function") {


                            //var args = { value: fieldValue, valueToShow: fieldValue, objectData: $control.parents("tr").get(0).dataSource }

                            var valueToShow = "";

                            if ($control.attr("u-datasource"))
                                valueToShow = $control.val();
                            else
                                valueToShow = fieldValue;


                            var args = { value: fieldValue, valueToShow: valueToShow, lastValue: $control.get(0).lastValue, lastValueToShow: $control.get(0).lastValueToShow, objectData: $control.parents("tr").get(0).dataSource }
                            converterHandler($control.get(0), args);
                            $control.get(0).lastValue = args.value;
                            $control.get(0).lastValueToShow = args.valueToShow;

                            // var data = $control.parents("tr").dataSource;
                            //dataSource[$control.attr("u-datafieldname")] = args.value;
                            $control.attr("value", args.value);
                            $control.val(args.valueToShow);

                            if (object["_" + fieldName] != args.value && object.state == "unmodified")
                                object.state = "modified";

                            object["_" + fieldName] = args.value;

                        }
                    }

                    else {

                        if (!$control.get(0).dataSource || !$control.attr("value")) {

                            $control.attr("value", fieldValue);
                            //$control.val(fieldValue);
                            if (object["_" + fieldName] != fieldValue && object.state == "unmodified")
                                object.state = "modified";
                            object["_" + fieldName] = fieldValue;
                            $control.val(fieldValue);
                            //$(this).parents("tr").get(0).dataSource[$(this).attr("u-datafieldname")] 

                        }

                        else {

                            if (object["_" + fieldName] != $control.attr("value") && object.state == "unmodified")
                                object.state = "modified";

                            object["_" + fieldName] = $control.attr("value");

                        }


                    }

                    //$control.attr("value", fieldValue);
                    //$control.val(fieldValue
                    //$control.change();

                }



                //if (_canInteract == true) {

                //    RecalculateColumnWidths();
                //}





                if (typeof (window[$bizDataGrid.attr("u-valueConverterhandler")]) == "function") {


                    //v3
                    var args = { fieldName: fieldName, value: object["_" + fieldName], valueToShow: undefined, lastValue: $control.get(0).lastValue, lastValueToShow: $control.get(0).lastValueToShow, objectData: $control.parents("tr").get(0).dataSource }
                    window[$bizDataGrid.attr("u-valueConverterhandler")]($control.get(0), args);


                    var valToAssign = typeof (args.value) == "undefined" ? object["_" + fieldName] : args.value;
                    $control.attr("value", valToAssign);

                    var toShow = typeof (args.valueToShow) == "undefined" ? object["_" + fieldName] : args.valueToShow;
                    $control.val(toShow);

                    $control.get(0).lastValueToShow = $control.val();

                    //if (object["_" + fieldName] != args.value && object.state == "unmodified")
                    //    object.state = "modified";

                    if (object["_" + fieldName] != valToAssign && object.state == "unmodified")
                        object.state = "modified";

                    object["_" + fieldName] = valToAssign;
                    $control.get(0).lastValue = object["_" + fieldName];


                }


                if (!($control.attr("u-datafieldpath") && $control.attr("u-datafieldpath").trim().indexOf("()") != -1))
                    validateData($control.get(0));

                if (typeof (that.onValueChanged) == "function") {

                    var args = { objectData: object, fieldName: fieldName };
                    that.onValueChanged($control.get(0), args);
                }

            }

        }


        this.dataSource = function (data) {

            if (typeof (data) == "undefined") {

                //updateSource();
                return _dataSource;
            }

            else {

                // _dataSource = data;
                _originalDataSource = cloneObj(data);
                _totalItems = (data && Object.keys(data).length) || 0;
                var oldDataSource = cloneObj(_dataSource);
                var source = toObjectsWithAccesors(data);

                //if (typeof (_dataSource) == "undefined" || _dataSource == null)
                _dataSource = [];

                $body.find("tr").remove();
                _removedRows = [];

                //if (typeof ($bizDataGrid.attr("u-paginationhandler")) != "undefined")
                //    setPage(_currentPage);
                if (typeof ($pager) != "undefined" && _dataSource != null && typeof ($bizDataGrid.attr("u-paginationhandler")) == "undefined") {


                    _dataSource = source;
                    _totalPages = getTotalPages();
                    $pager.find(".u-endButton").show();
                    setPage(1);
                }
                else {
                    _dataSource = source;
                    bindData(source);
                }

                if (typeof (that.onDataSourceChanged) == "function") {
                    that.onDataSourceChanged(_dataSource, oldDataSource);
                }
            }

            if ($body.find("tr").length == 0)
                $header.css("overflow-x", "scroll");
            else
                $header.css("overflow-x", "hidden");

            if (((data && data.length == 0) || data == null) && that.onRowSelected)
                that.onRowSelected(null);

        }



        this.dataSourceWithRemoved = function () {


            //  updateSource();

            var allData = [];


            for (var x = 0; x < _removedRows.length; x++) {
                allData.push(_removedRows[x].get(0).dataSource);
            }

            for (var x = 0; x < _dataSource.length; x++) {
                allData.push(_dataSource[x]);
            }

            return allData;
        }
        this.clearRemovedRows = function () {

            _removedRows = [];
        }



        function updateSource() {




            $body.find("tr").each(function (index, row) {

                $(row).find("[u-datafieldname]").each(function (index, control) {

                    if ($(control).attr("u-bindmode") == "oneway")
                        return;

                    var fieldName = $(control).attr("u-datafieldname");
                    if (fieldName in row.dataSource) {

                        var _valueToAssign = { value: null };
                        //if (typeof($(control).attr("value")) != "undefined")
                        _valueToAssign.value = $(control).attr("value");
                        //else
                        //    _valueToAssign.value = $(control).val();

                        var eventArgs = {

                            fieldName: fieldName,
                            valueToAssign: _valueToAssign,
                            control: control,
                            rowData: row.dataSource

                        }

                        if (typeof (that.onSourceUpdating) == "function")
                            that.onSourceUpdating(eventArgs);


                        row.dataSource[fieldName] = _valueToAssign.value;

                    }
                });

            });
        }

        this.onSourceUpdating;

        function bindData(data) {



            _canInteract = false;
            for (var x = 0; x < data.length; x++) {

                // for (var x = data.length-1 ; x >=0; x--) {


                _addRow(data[x]);

            }
            lastSelectedRow = -1;

            that.selectedRow(0);
            _canInteract = true;
            doRecalculateColumns();
            if ($body.find("tr").length == 0)
                $header.css("overflow-x", "visible");
            else
                $header.css("overflow-x", "hidden");
            validateGrid();

            if (typeof (that.onDataBinded) == "function") {
                that.onDataBinded();
            }
        }

        //function bindData() {

        //    if (typeof (_dataSource) == "undefined" || _dataSource == null)
        //        _dataSource = [];


        //    for (var x = 0; x < _dataSource.length; x++) {


        //        that.addRow(_dataSource[x]);

        //    }

        //    that.selectedRow(0);

        //    RecalculateColumnWidths();
        //}

        this.refreshUI = function () {
            RecalculateColumnWidths();
        };


        this.mynewvar = null;



        this.setExportButton = function (ID) {

            var scriptpath = $("script[src*='bizDataGrid.js']").attr("src").split('bizDataGrid.js')[0];

            Downloadify.create(ID, {
                filename: function () {
                    return that.excelFileName;
                },
                data: function () {
                    return getTableToExport().outerHTML.latinise();
                },
                onComplete: function () { alert('la información ha sido exportado con exito'); },
                //onCancel: function () { alert('You have cancelled the saving of this file.'); },
                //onError: function () { alert('You must put something in the File Contents or there will be nothing to save!'); },

                swf: scriptpath + 'downloadify/media/downloadify.swf',
                downloadImage: scriptpath + 'downloadify/images/download.png',
                width: 48,
                height: 37.75,
                transparent: true,
                append: false
            });


        }

        var Latinise = {}; Latinise.latin_map = { "Á": "A", "Ă": "A", "Ắ": "A", "Ặ": "A", "Ằ": "A", "Ẳ": "A", "Ẵ": "A", "Ǎ": "A", "Â": "A", "Ấ": "A", "Ậ": "A", "Ầ": "A", "Ẩ": "A", "Ẫ": "A", "Ä": "A", "Ǟ": "A", "Ȧ": "A", "Ǡ": "A", "Ạ": "A", "Ȁ": "A", "À": "A", "Ả": "A", "Ȃ": "A", "Ā": "A", "Ą": "A", "Å": "A", "Ǻ": "A", "Ḁ": "A", "Ⱥ": "A", "Ã": "A", "Ꜳ": "AA", "Æ": "AE", "Ǽ": "AE", "Ǣ": "AE", "Ꜵ": "AO", "Ꜷ": "AU", "Ꜹ": "AV", "Ꜻ": "AV", "Ꜽ": "AY", "Ḃ": "B", "Ḅ": "B", "Ɓ": "B", "Ḇ": "B", "Ƀ": "B", "Ƃ": "B", "Ć": "C", "Č": "C", "Ç": "C", "Ḉ": "C", "Ĉ": "C", "Ċ": "C", "Ƈ": "C", "Ȼ": "C", "Ď": "D", "Ḑ": "D", "Ḓ": "D", "Ḋ": "D", "Ḍ": "D", "Ɗ": "D", "Ḏ": "D", "ǲ": "D", "ǅ": "D", "Đ": "D", "Ƌ": "D", "Ǳ": "DZ", "Ǆ": "DZ", "É": "E", "Ĕ": "E", "Ě": "E", "Ȩ": "E", "Ḝ": "E", "Ê": "E", "Ế": "E", "Ệ": "E", "Ề": "E", "Ể": "E", "Ễ": "E", "Ḙ": "E", "Ë": "E", "Ė": "E", "Ẹ": "E", "Ȅ": "E", "È": "E", "Ẻ": "E", "Ȇ": "E", "Ē": "E", "Ḗ": "E", "Ḕ": "E", "Ę": "E", "Ɇ": "E", "Ẽ": "E", "Ḛ": "E", "Ꝫ": "ET", "Ḟ": "F", "Ƒ": "F", "Ǵ": "G", "Ğ": "G", "Ǧ": "G", "Ģ": "G", "Ĝ": "G", "Ġ": "G", "Ɠ": "G", "Ḡ": "G", "Ǥ": "G", "Ḫ": "H", "Ȟ": "H", "Ḩ": "H", "Ĥ": "H", "Ⱨ": "H", "Ḧ": "H", "Ḣ": "H", "Ḥ": "H", "Ħ": "H", "Í": "I", "Ĭ": "I", "Ǐ": "I", "Î": "I", "Ï": "I", "Ḯ": "I", "İ": "I", "Ị": "I", "Ȉ": "I", "Ì": "I", "Ỉ": "I", "Ȋ": "I", "Ī": "I", "Į": "I", "Ɨ": "I", "Ĩ": "I", "Ḭ": "I", "Ꝺ": "D", "Ꝼ": "F", "Ᵹ": "G", "Ꞃ": "R", "Ꞅ": "S", "Ꞇ": "T", "Ꝭ": "IS", "Ĵ": "J", "Ɉ": "J", "Ḱ": "K", "Ǩ": "K", "Ķ": "K", "Ⱪ": "K", "Ꝃ": "K", "Ḳ": "K", "Ƙ": "K", "Ḵ": "K", "Ꝁ": "K", "Ꝅ": "K", "Ĺ": "L", "Ƚ": "L", "Ľ": "L", "Ļ": "L", "Ḽ": "L", "Ḷ": "L", "Ḹ": "L", "Ⱡ": "L", "Ꝉ": "L", "Ḻ": "L", "Ŀ": "L", "Ɫ": "L", "ǈ": "L", "Ł": "L", "Ǉ": "LJ", "Ḿ": "M", "Ṁ": "M", "Ṃ": "M", "Ɱ": "M", "Ń": "N", "Ň": "N", "Ņ": "N", "Ṋ": "N", "Ṅ": "N", "Ṇ": "N", "Ǹ": "N", "Ɲ": "N", "Ṉ": "N", "Ƞ": "N", "ǋ": "N", "Ñ": "N", "Ǌ": "NJ", "Ó": "O", "Ŏ": "O", "Ǒ": "O", "Ô": "O", "Ố": "O", "Ộ": "O", "Ồ": "O", "Ổ": "O", "Ỗ": "O", "Ö": "O", "Ȫ": "O", "Ȯ": "O", "Ȱ": "O", "Ọ": "O", "Ő": "O", "Ȍ": "O", "Ò": "O", "Ỏ": "O", "Ơ": "O", "Ớ": "O", "Ợ": "O", "Ờ": "O", "Ở": "O", "Ỡ": "O", "Ȏ": "O", "Ꝋ": "O", "Ꝍ": "O", "Ō": "O", "Ṓ": "O", "Ṑ": "O", "Ɵ": "O", "Ǫ": "O", "Ǭ": "O", "Ø": "O", "Ǿ": "O", "Õ": "O", "Ṍ": "O", "Ṏ": "O", "Ȭ": "O", "Ƣ": "OI", "Ꝏ": "OO", "Ɛ": "E", "Ɔ": "O", "Ȣ": "OU", "Ṕ": "P", "Ṗ": "P", "Ꝓ": "P", "Ƥ": "P", "Ꝕ": "P", "Ᵽ": "P", "Ꝑ": "P", "Ꝙ": "Q", "Ꝗ": "Q", "Ŕ": "R", "Ř": "R", "Ŗ": "R", "Ṙ": "R", "Ṛ": "R", "Ṝ": "R", "Ȑ": "R", "Ȓ": "R", "Ṟ": "R", "Ɍ": "R", "Ɽ": "R", "Ꜿ": "C", "Ǝ": "E", "Ś": "S", "Ṥ": "S", "Š": "S", "Ṧ": "S", "Ş": "S", "Ŝ": "S", "Ș": "S", "Ṡ": "S", "Ṣ": "S", "Ṩ": "S", "Ť": "T", "Ţ": "T", "Ṱ": "T", "Ț": "T", "Ⱦ": "T", "Ṫ": "T", "Ṭ": "T", "Ƭ": "T", "Ṯ": "T", "Ʈ": "T", "Ŧ": "T", "Ɐ": "A", "Ꞁ": "L", "Ɯ": "M", "Ʌ": "V", "Ꜩ": "TZ", "Ú": "U", "Ŭ": "U", "Ǔ": "U", "Û": "U", "Ṷ": "U", "Ü": "U", "Ǘ": "U", "Ǚ": "U", "Ǜ": "U", "Ǖ": "U", "Ṳ": "U", "Ụ": "U", "Ű": "U", "Ȕ": "U", "Ù": "U", "Ủ": "U", "Ư": "U", "Ứ": "U", "Ự": "U", "Ừ": "U", "Ử": "U", "Ữ": "U", "Ȗ": "U", "Ū": "U", "Ṻ": "U", "Ų": "U", "Ů": "U", "Ũ": "U", "Ṹ": "U", "Ṵ": "U", "Ꝟ": "V", "Ṿ": "V", "Ʋ": "V", "Ṽ": "V", "Ꝡ": "VY", "Ẃ": "W", "Ŵ": "W", "Ẅ": "W", "Ẇ": "W", "Ẉ": "W", "Ẁ": "W", "Ⱳ": "W", "Ẍ": "X", "Ẋ": "X", "Ý": "Y", "Ŷ": "Y", "Ÿ": "Y", "Ẏ": "Y", "Ỵ": "Y", "Ỳ": "Y", "Ƴ": "Y", "Ỷ": "Y", "Ỿ": "Y", "Ȳ": "Y", "Ɏ": "Y", "Ỹ": "Y", "Ź": "Z", "Ž": "Z", "Ẑ": "Z", "Ⱬ": "Z", "Ż": "Z", "Ẓ": "Z", "Ȥ": "Z", "Ẕ": "Z", "Ƶ": "Z", "Ĳ": "IJ", "Œ": "OE", "ᴀ": "A", "ᴁ": "AE", "ʙ": "B", "ᴃ": "B", "ᴄ": "C", "ᴅ": "D", "ᴇ": "E", "ꜰ": "F", "ɢ": "G", "ʛ": "G", "ʜ": "H", "ɪ": "I", "ʁ": "R", "ᴊ": "J", "ᴋ": "K", "ʟ": "L", "ᴌ": "L", "ᴍ": "M", "ɴ": "N", "ᴏ": "O", "ɶ": "OE", "ᴐ": "O", "ᴕ": "OU", "ᴘ": "P", "ʀ": "R", "ᴎ": "N", "ᴙ": "R", "ꜱ": "S", "ᴛ": "T", "ⱻ": "E", "ᴚ": "R", "ᴜ": "U", "ᴠ": "V", "ᴡ": "W", "ʏ": "Y", "ᴢ": "Z", "á": "a", "ă": "a", "ắ": "a", "ặ": "a", "ằ": "a", "ẳ": "a", "ẵ": "a", "ǎ": "a", "â": "a", "ấ": "a", "ậ": "a", "ầ": "a", "ẩ": "a", "ẫ": "a", "ä": "a", "ǟ": "a", "ȧ": "a", "ǡ": "a", "ạ": "a", "ȁ": "a", "à": "a", "ả": "a", "ȃ": "a", "ā": "a", "ą": "a", "ᶏ": "a", "ẚ": "a", "å": "a", "ǻ": "a", "ḁ": "a", "ⱥ": "a", "ã": "a", "ꜳ": "aa", "æ": "ae", "ǽ": "ae", "ǣ": "ae", "ꜵ": "ao", "ꜷ": "au", "ꜹ": "av", "ꜻ": "av", "ꜽ": "ay", "ḃ": "b", "ḅ": "b", "ɓ": "b", "ḇ": "b", "ᵬ": "b", "ᶀ": "b", "ƀ": "b", "ƃ": "b", "ɵ": "o", "ć": "c", "č": "c", "ç": "c", "ḉ": "c", "ĉ": "c", "ɕ": "c", "ċ": "c", "ƈ": "c", "ȼ": "c", "ď": "d", "ḑ": "d", "ḓ": "d", "ȡ": "d", "ḋ": "d", "ḍ": "d", "ɗ": "d", "ᶑ": "d", "ḏ": "d", "ᵭ": "d", "ᶁ": "d", "đ": "d", "ɖ": "d", "ƌ": "d", "ı": "i", "ȷ": "j", "ɟ": "j", "ʄ": "j", "ǳ": "dz", "ǆ": "dz", "é": "e", "ĕ": "e", "ě": "e", "ȩ": "e", "ḝ": "e", "ê": "e", "ế": "e", "ệ": "e", "ề": "e", "ể": "e", "ễ": "e", "ḙ": "e", "ë": "e", "ė": "e", "ẹ": "e", "ȅ": "e", "è": "e", "ẻ": "e", "ȇ": "e", "ē": "e", "ḗ": "e", "ḕ": "e", "ⱸ": "e", "ę": "e", "ᶒ": "e", "ɇ": "e", "ẽ": "e", "ḛ": "e", "ꝫ": "et", "ḟ": "f", "ƒ": "f", "ᵮ": "f", "ᶂ": "f", "ǵ": "g", "ğ": "g", "ǧ": "g", "ģ": "g", "ĝ": "g", "ġ": "g", "ɠ": "g", "ḡ": "g", "ᶃ": "g", "ǥ": "g", "ḫ": "h", "ȟ": "h", "ḩ": "h", "ĥ": "h", "ⱨ": "h", "ḧ": "h", "ḣ": "h", "ḥ": "h", "ɦ": "h", "ẖ": "h", "ħ": "h", "ƕ": "hv", "í": "i", "ĭ": "i", "ǐ": "i", "î": "i", "ï": "i", "ḯ": "i", "ị": "i", "ȉ": "i", "ì": "i", "ỉ": "i", "ȋ": "i", "ī": "i", "į": "i", "ᶖ": "i", "ɨ": "i", "ĩ": "i", "ḭ": "i", "ꝺ": "d", "ꝼ": "f", "ᵹ": "g", "ꞃ": "r", "ꞅ": "s", "ꞇ": "t", "ꝭ": "is", "ǰ": "j", "ĵ": "j", "ʝ": "j", "ɉ": "j", "ḱ": "k", "ǩ": "k", "ķ": "k", "ⱪ": "k", "ꝃ": "k", "ḳ": "k", "ƙ": "k", "ḵ": "k", "ᶄ": "k", "ꝁ": "k", "ꝅ": "k", "ĺ": "l", "ƚ": "l", "ɬ": "l", "ľ": "l", "ļ": "l", "ḽ": "l", "ȴ": "l", "ḷ": "l", "ḹ": "l", "ⱡ": "l", "ꝉ": "l", "ḻ": "l", "ŀ": "l", "ɫ": "l", "ᶅ": "l", "ɭ": "l", "ł": "l", "ǉ": "lj", "ſ": "s", "ẜ": "s", "ẛ": "s", "ẝ": "s", "ḿ": "m", "ṁ": "m", "ṃ": "m", "ɱ": "m", "ᵯ": "m", "ᶆ": "m", "ń": "n", "ň": "n", "ņ": "n", "ṋ": "n", "ȵ": "n", "ṅ": "n", "ṇ": "n", "ǹ": "n", "ɲ": "n", "ṉ": "n", "ƞ": "n", "ᵰ": "n", "ᶇ": "n", "ɳ": "n", "ñ": "n", "ǌ": "nj", "ó": "o", "ŏ": "o", "ǒ": "o", "ô": "o", "ố": "o", "ộ": "o", "ồ": "o", "ổ": "o", "ỗ": "o", "ö": "o", "ȫ": "o", "ȯ": "o", "ȱ": "o", "ọ": "o", "ő": "o", "ȍ": "o", "ò": "o", "ỏ": "o", "ơ": "o", "ớ": "o", "ợ": "o", "ờ": "o", "ở": "o", "ỡ": "o", "ȏ": "o", "ꝋ": "o", "ꝍ": "o", "ⱺ": "o", "ō": "o", "ṓ": "o", "ṑ": "o", "ǫ": "o", "ǭ": "o", "ø": "o", "ǿ": "o", "õ": "o", "ṍ": "o", "ṏ": "o", "ȭ": "o", "ƣ": "oi", "ꝏ": "oo", "ɛ": "e", "ᶓ": "e", "ɔ": "o", "ᶗ": "o", "ȣ": "ou", "ṕ": "p", "ṗ": "p", "ꝓ": "p", "ƥ": "p", "ᵱ": "p", "ᶈ": "p", "ꝕ": "p", "ᵽ": "p", "ꝑ": "p", "ꝙ": "q", "ʠ": "q", "ɋ": "q", "ꝗ": "q", "ŕ": "r", "ř": "r", "ŗ": "r", "ṙ": "r", "ṛ": "r", "ṝ": "r", "ȑ": "r", "ɾ": "r", "ᵳ": "r", "ȓ": "r", "ṟ": "r", "ɼ": "r", "ᵲ": "r", "ᶉ": "r", "ɍ": "r", "ɽ": "r", "ↄ": "c", "ꜿ": "c", "ɘ": "e", "ɿ": "r", "ś": "s", "ṥ": "s", "š": "s", "ṧ": "s", "ş": "s", "ŝ": "s", "ș": "s", "ṡ": "s", "ṣ": "s", "ṩ": "s", "ʂ": "s", "ᵴ": "s", "ᶊ": "s", "ȿ": "s", "ɡ": "g", "ᴑ": "o", "ᴓ": "o", "ᴝ": "u", "ť": "t", "ţ": "t", "ṱ": "t", "ț": "t", "ȶ": "t", "ẗ": "t", "ⱦ": "t", "ṫ": "t", "ṭ": "t", "ƭ": "t", "ṯ": "t", "ᵵ": "t", "ƫ": "t", "ʈ": "t", "ŧ": "t", "ᵺ": "th", "ɐ": "a", "ᴂ": "ae", "ǝ": "e", "ᵷ": "g", "ɥ": "h", "ʮ": "h", "ʯ": "h", "ᴉ": "i", "ʞ": "k", "ꞁ": "l", "ɯ": "m", "ɰ": "m", "ᴔ": "oe", "ɹ": "r", "ɻ": "r", "ɺ": "r", "ⱹ": "r", "ʇ": "t", "ʌ": "v", "ʍ": "w", "ʎ": "y", "ꜩ": "tz", "ú": "u", "ŭ": "u", "ǔ": "u", "û": "u", "ṷ": "u", "ü": "u", "ǘ": "u", "ǚ": "u", "ǜ": "u", "ǖ": "u", "ṳ": "u", "ụ": "u", "ű": "u", "ȕ": "u", "ù": "u", "ủ": "u", "ư": "u", "ứ": "u", "ự": "u", "ừ": "u", "ử": "u", "ữ": "u", "ȗ": "u", "ū": "u", "ṻ": "u", "ų": "u", "ᶙ": "u", "ů": "u", "ũ": "u", "ṹ": "u", "ṵ": "u", "ᵫ": "ue", "ꝸ": "um", "ⱴ": "v", "ꝟ": "v", "ṿ": "v", "ʋ": "v", "ᶌ": "v", "ⱱ": "v", "ṽ": "v", "ꝡ": "vy", "ẃ": "w", "ŵ": "w", "ẅ": "w", "ẇ": "w", "ẉ": "w", "ẁ": "w", "ⱳ": "w", "ẘ": "w", "ẍ": "x", "ẋ": "x", "ᶍ": "x", "ý": "y", "ŷ": "y", "ÿ": "y", "ẏ": "y", "ỵ": "y", "ỳ": "y", "ƴ": "y", "ỷ": "y", "ỿ": "y", "ȳ": "y", "ẙ": "y", "ɏ": "y", "ỹ": "y", "ź": "z", "ž": "z", "ẑ": "z", "ʑ": "z", "ⱬ": "z", "ż": "z", "ẓ": "z", "ȥ": "z", "ẕ": "z", "ᵶ": "z", "ᶎ": "z", "ʐ": "z", "ƶ": "z", "ɀ": "z", "ﬀ": "ff", "ﬃ": "ffi", "ﬄ": "ffl", "ﬁ": "fi", "ﬂ": "fl", "ĳ": "ij", "œ": "oe", "ﬆ": "st", "ₐ": "a", "ₑ": "e", "ᵢ": "i", "ⱼ": "j", "ₒ": "o", "ᵣ": "r", "ᵤ": "u", "ᵥ": "v", "ₓ": "x" };
        String.prototype.latinise = function () { return this.replace(/[^A-Za-z0-9\[\] ]/g, function (a) { return Latinise.latin_map[a] || a }) };

        toStringExt = function (object) {

            if (object == null)
                return "";
            else
                return object.toString().trim();
        }

        this.exportToExcel = function () {
            tableToExcel($body.get(0), "data", that.excelFileName);
        };

        this.exportToExcelIE = function (exportButtonContainerID) {
            tableToExcel($body.get(0), "data", that.excelFileName, exportButtonContainerID);
        };



        var timeOutRecalc;
        var firstTimeRecalc = true;
        function RecalculateColumnWidths() {

            if (firstTimeRecalc == true) {
                doRecalculateColumns();
                firstTimeRecalc = false;
            }

            clearTimeout(timeOutRecalc);
            timeOutRecalc = setTimeout(function () {
                console.log("recalculating");
                doRecalculateColumns();
                //firstTimeRecalc = true;

            }, 200);
        }

        //function doRecalculateColumns() {

        //    if (that.disabledRecalc == true)
        //        return;

        //    var columnCount = $header.find("tr:nth-child(1)").find("td").length;
        //    var rowCount = $body.find("tr").length + 1;
        //    var maxWidth = 0;
        //    //$body.css("display", "none");
        //    //$header.css("display", "none");

        //    for (var y = 0; y < columnCount; y++) {
        //        maxWidth = 0;
        //        for (var x = 0; x < rowCount; x++) {

        //            if (x == 0) {

        //                //  var tdWidth = getWidthOfElText($header.find("tr").eq(0).find("td").eq(y));
        //                var tdWidth = getWidthOfElText($header.find("tr").eq(0).find("td").eq(y));

        //                if (tdWidth > maxWidth)
        //                    maxWidth = tdWidth;
        //            }

        //            else {

        //                // var inputWidth = getWidthOfElText($body.find("tr").eq(x - 1).find("td").eq(y).find("input"));
        //                var inputWidth = getWidthOfElText($body.find("tr").eq(x - 1).find("td").eq(y).find("input"));

        //                if (inputWidth > maxWidth)
        //                    maxWidth = inputWidth;

        //            }
        //        }


        //        if ($header.find("td").eq(y).find(".u-arrows").length > 0)
        //            maxWidth += 50;

        //        if (y in _lastMaxWidths) {
        //            if (Math.abs(_lastMaxWidths[y].maxWidth - maxWidth) >= 2 || ($body.find("tr:nth-child(1)").find("td").get(y) && $body.find("tr:nth-child(1)").find("td").get(y).style.maxWidth == "")) {


        //                $body.find("td:nth-child(" + (y + 1) + ")").css({ width: maxWidth, minWidth: maxWidth + "px", maxWidth: maxWidth + "px" });
        //                $header.find("td:nth-child(" + (y + 1) + ")").css({ width: maxWidth, minWidth: maxWidth + "px", maxWidth: maxWidth + "px" });

        //            }
        //        }
        //        else {

        //            $body.find("td:nth-child(" + (y + 1) + ")").css({ width: maxWidth + "px", minWidth: maxWidth + "px", maxWidth: maxWidth + "px" });
        //            $header.find("td:nth-child(" + (y + 1) + ")").css({ width: maxWidth + "px", minWidth: maxWidth + "px", maxWidth: maxWidth + "px" });
        //        }


        //        _lastMaxWidths[y] = {};
        //        _lastMaxWidths[y].maxWidth = maxWidth;

        //    }

        //    $pager.width($body.outerWidth());




        //    if ($body.find("tr").length > 0)
        //        $header.width($body.width());

        //}



        function doRecalculateColumns() {


            if (window.dont)
                return;

            var columnCount = $header.find("tr:nth-child(1)").find("td").length;
            var rowCount = $body.find("tr").length + 1;
            var maxWidth = 0;
            var columnsCSS = "";
            //$body.css("display", "none");
            //$header.css("display", "none");

            var wrapper = $("<div style='float:left;display:none'> </div>");
            var measureSpan = $("<div style='float:left;' id='measureSpan' />");

            wrapper.append(measureSpan);
            $("body").append(wrapper);

            var myWidth = 0;
            for (var x = 0; x < columnCount; x++) {


                wrapper.html("");
                measureSpan = $("<div style='float:left;' id='measureSpan' />");
                wrapper.append(measureSpan);

                var myWidth = 0;

                if ($template.find("bizdatagrid-columntemplate").eq(x).attr("u-width")) {

                    myWidth = $template.find("bizdatagrid-columntemplate").eq(x).attr("u-width");

                }


                else {

                    //measureSpan.html("");

                    var columns = $body.find("td:nth-child(" + (x + 1) + ")");

                    var h = $header.find("td:nth-child(" + (x + 1) + ")").clone();
                    h.css("font-family", $header.find("td:nth-child(" + (x + 1) + ")").css("font-family"));
                    h.css("font-size", $header.find("td:nth-child(" + (x + 1) + ")").css("font-size"));

                    measureSpan.append(h);


                    if (_options.fitColumnToContents)
                        for (var y = 0; y < columns.length; y++) {

                            var inp = columns.eq(y).find(".textInput");

                            measureSpan.append("<br>");
                            var textContainer = $("<div style='float:left'/>")
                            textContainer.css("font-family", inp.css("font-family"));
                            textContainer.css("font-size", inp.css("font-size"));
                            textContainer.html(inp.val());
                            measureSpan.append(textContainer);
                        }

                    wrapper.css("display", "block");
                    wrapper.css("float", "left");
                    wrapper.append(columns.eq(x).find(":not([u-datafieldname],.tbRowNumber)").clone());
                    //myWidth = (wrapper.width() + 35 + 5) + "px";
                    myWidth = (wrapper.width() + 30) + "px";

                }



                columnsCSS += "[u-id='" + $bizDataGrid.attr("u-id") + "'] .BizDataGridBody td:nth-child(" + (x + 1) + ") , [u-id='" + $bizDataGrid.attr("u-id") + "'] .BizDataGridHeader td:nth-child(" + (x + 1) + "){";
                columnsCSS += "min-width:" + myWidth + ";"

                columnsCSS += "max-width:" + myWidth + ";";
                columnsCSS += "width:" + myWidth + ";";
                columnsCSS += "}";
                //columns.css({ minWidth: myWidth, maxWidth: myWidth, width: myWidth });
                //$header.find("td:nth-child(" + (x + 1) + ")").css({ minWidth: myWidth, maxWidth: myWidth, width: myWidth });

            }

            wrapper.remove();
            $("#grid" + $bizDataGrid.attr("u-id") + "columnsWidths").remove();
            AddStyleElement("grid" + $bizDataGrid.attr("u-id") + "columnsWidths", columnsCSS);


            measureSpan.remove();


            if ($body.find("tr").length > 0) {



                if ($bizDataGrid.attr("u-fillspace") == "true")
                    $pager.css("width", "100%");
                else
                    $pager.width($body.outerWidth());

            }

        }




        function InicializeDataGrid(container, options) {


            $(".BizDataGrid").css("visibility", "hidden");

            if (typeof (options) == "object") {
                for (var opt in options) {
                    _options[opt] = options[opt];
                }
            }


            
                
            $container = $(container);
            $template = $container.find("bizdatagrid-rowtemplate");
            $template.remove();


            if (options && options.dataSource) {


                    var columns = null;
                if (options.dataSource.length > 0) 
                     columns = options.dataSource[0];

                if (options.view) {
                        columns = {};
                        names = options.view.split(",");

                        for (var i in names) {

                            columns[names[i]] = "";
                        }
                    }

                    for (var columnName in columns) {


                        var $templ = $template.find("[u-datafieldname='" + columnName + "'] ");

                        if ($templ.length > 0)
                            continue;

                        else {

                            var displayName = columnName;
                            var readOnly = false;
                            var onclick = null;
                            var required = false;
                            var dataType = "text";
                            var length = null;
                            var inputType = null;
                            var trueValue = null;
                            var falseValue = null;


                            if (options.columns)
                                for (var x = 0; x < options.columns.length; x++) {

                                    if (options.columns[x].fieldName == columnName) {
                                        if (options.columns[x].displayName != "")
                                            displayName = options.columns[x].displayName;
                                        if (options.columns[x].readOnly)
                                            readOnly = options.columns[x].readOnly;
                                        if (options.columns[x].onclick)
                                            onclick = options.columns[x].onclick;
                                        if (options.columns[x].required === true)
                                            required = true;

                                        dataType = options.columns[x].dataType;
                                        length = options.columns[x].length;
                                        inputType = options.columns[x].inputType;
                                        trueValue = options.columns[x].trueValue;
                                        falseValue = options.columns[x].falseValue;

                                        break;
                                    }
                                }

                            if (inputType == "checkbox") {

                                var $templ = $("<BizDataGrid-ColumnTemplate u-headerName='" + displayName + "' u-canfilter='" + "true" + "' u-filterfieldname='" + columnName + "' u-cansort='true'>" +
                        "<input type='checkbox'    u-datafieldname='" + columnName + "' u-truevalue='" + trueValue + "' u-falsevalue='" + falseValue + "'   style='text-align:left;'>" +
                   "</BizDataGrid-ColumnTemplate>'");

                            }

                            else {

                                var $templ = $("<BizDataGrid-ColumnTemplate u-headerName='" + displayName + "' u-canfilter='" + "true" + "' u-filterfieldname='" + columnName + "' u-cansort='true'>" +
                        "<input type='text' class='textInput'   u-datafieldname='" + columnName + "'   style='text-align:left;'>" +
                   "</BizDataGrid-ColumnTemplate>'");

                            }

                            if (dataType == "number") {

                                $templ.find("input").attr("u-validators", "number");
                            }


                            if (readOnly === true) {

                                $templ.find("input").attr("readonly", "readonly");
                            }

                            if (onclick) {

                                $templ.find("input").attr("onclick", onclick.name + "(this);");
                            }

                            if (required) {

                                $templ.find("input").attr("u-validators", "requiered");
                            }

                            if (length) {

                                $templ.find("input").attr("maxlength", length);

                            }
                            $template.append($templ)
                        }

                    }

             



            }

            else if (options && options.columns) {

                for (var i in options.columns) {

                    var column = options.columns[i];

                    var $templ = $template.find("[u-datafieldname='" + column.name + "'] ");

                    if ($templ.length > 0)
                        continue;

                    else {

                        var $templ = $("<BizDataGrid-ColumnTemplate u-headerName='" + column.name + "' u-canfilter='" + (column.canFilter || true) + "' u-filterfieldname='" + (column.filterFieldname || column.name) + "' u-cansort='" + (column.canSort || true) + "'>" +
                           "<input type='text' class='textInput '  u-datafieldname='" + column.name + "'   style='text-align:left;'>" +
                      "</BizDataGrid-ColumnTemplate>'");

                        $template.append($templ)
                    }

                }
            }

            //var containerWidth = $container.width();
            $bizDataGrid = $(".BizDataGrid", container);
            $bizDataGrid.attr("u-id", new Date().getTime());
            $bizDataGrid.find("*[class*='BizDataGrid']").remove();

            $bizDataGrid.get(0).BizDataGrid = that;
            //$bizDataGrid.css({ width: containerWidth, minWidth: containerWidth, maxWidth: containerWidth });

            //var $BodyGrid = $(".BizDataGridBody", $bizDataGrid);
            //var $HeaderGrid = $(".BizDataGridHeader", $bizDataGrid);


            if (_showRowNumber == true) {

                $template.prepend($('<BizDataGrid-ColumnTemplate u-headerName="No." >' +
                        '<input  type="text"  class="textInput tbRowNumber"  readonly="true" style="text-align:center"></BizDataGrid-ColumnTemplate>'));
                //$template.prepend($('<BizDataGrid-ColumnTemplate u-headerName="Válido" >' +
                //        '<input  type="text"  class="textInput tbRowNumber"  readonly="true" style="text-align:center"></BizDataGrid-ColumnTemplate>'));

            }


            if ($bizDataGrid.attr("u-fillspace") == "true") {

                $template.append($('<BizDataGrid-ColumnTemplate u-headerName="" style="width:100%;min-width:100%;max-width:100%" u-canfilter="false" u-cansort="false" >' +
                        '</BizDataGrid-ColumnTemplate>'));

            }

            AddTitle();
            AddHeader();
            AddBody();
            AddPager();
            //AddExcelExport();
            //AddFastAccessKeys();

            //if (typeof (window[$bizDataGrid.attr("u-paginationhandler")]) == "function") {


            //    _currentFilter = { fieldName: null, filterValue: null, direction: null, pageNumber: 1, pageSize: _paginationSize };
            //    setPage(1);

            //}

            //else if (typeof (window[$bizDataGrid.attr("u-filterhandler")]) == "function" && typeof (window[$bizDataGrid.attr("u-paginationhandler")]) != "function") {


            //    _currentFilter = { fieldName: null, filterValue: null, direction: null, pageNumber: 1, pageSize: _paginationSize };
            //    //setPage(1);
            //    (window[$bizDataGrid.attr("u-filterhandler")])(_currentFilter);

            //}


            $body.on("change keyup", "input", function (e) {


                if (e.target.type == "text") {
                    if (e.type == "change" && $(e.target).val() == "")
                        return;
                    if (e.type == "keyup" && $(e.target).val() != "")
                        return;
                }


                var data = $(this).parents("tr").get(0).dataSource;
                //data[$(this).attr("u-datafieldname")] = $(this).val();

                if ($(this).attr("u-datasource")) {

                    updateControlData($(this).attr("u-datafieldname"), $(this).attr("value"), data);

                }

                else {

                    if (this.type == "checkbox"){

                      

                         updateControlData($(this).attr("u-datafieldname"),  this.checked , data);
                    

                    }
                    else {
                        updateControlData($(this).attr("u-datafieldname"), $(this).val(), data);

                    }
                }



                RecalculateColumnWidths();



            });

            RecalculateColumnWidths();

            if ($body.find("tr").length == 0)
                $header.css("overflow-x", "visible");
            else
                $header.css("overflow-x", "hidden");


            if (options.dataSource)
                that.dataSource(options.dataSource);

            $(".BizDataGrid").css("visibility", "visible");



        }

        function AddExcelExport() {

            var btnExport = $("<div unselectable='on' style='cursor:pointer' href='javascript:;' onclick='exportarExcel();' class='ms-cui-ctl-large ' aria-describedby='Ribbon.List.Actions.ExportToSpreadsheet_ToolTip' mscui:controltype='Button' role='button' id='Ribbon.List.Actions.ExportToSpreadsheet-Large'><span unselectable='on' class='ms-cui-ctl-largeIconContainer'><span unselectable='on' class=' ms-cui-img-32by32 ms-cui-img-cont-float'><img unselectable='on' alt='' src='/_layouts/15/3082/images/formatmap32x32.png?rev=23' style='top: -239px; left: -307px;'></span></span><span unselectable='on' class='ms-cui-ctl-largelabel'>Exportar a<br>Excel</span></div>");
            $bizDataGrid.find(".u-header-title").append(btnExport);
            btnExport.click(that.exportToExcel);

        }

        this.Validate = function (entities) {

            for (var x = 0; x < entities.length; x++) {

                var row = that.getRow(entities[x]);

                var columnsToValidate = $(row).find("[u-validators]");

                for (var y = 0; y < columnsToValidate.length; y++) {

                    validateData(columnsToValidate[y]);

                }
            }

        }

        function validateGrid() {

            $("[u-validators]", $bizDataGrid).each(function (index, value) {

                validateData(value);
            });

        }

        function AddFastAccessKeys() {


            if (!window.__ufastAcessKeyAdded) {
                $(document).on("keydown", function (e) {



                    var code = e.keyCode || e.which;

                    if (e.ctrlKey) {


                        if (code == 69) {
                            e.preventDefault();
                            window.__uLastSelectedGrid.exportToExcel();

                        }
                        if (code == 65) {
                            e.preventDefault();
                            if (_canUserAdd == true)
                                window.__uLastSelectedGrid.addRow();

                        }
                        if (code == 68) {
                            e.preventDefault();
                            if (_canUserRemove == true)
                                window.__uLastSelectedGrid.removeRow();


                        }
                    }
                });

                window.__ufastAcessKeyAdded = true;

            }



        }



        function validateData(input) {

            if (_canValidate == false)
                return;

            var validators = $(input).attr("u-validators");

            if (typeof (validators) != "undefined") {

                validatorsCount = validators.split(" ").length;
                for (var x = 0; x < validatorsCount; x++) {


                    if (validators.indexOf("requiered") != -1) {

                        if ($(input).val().trim() == "") {

                            AddError(input, $bizDataGrid.find("u-message[u-validatorname = 'requiered']").text().trim());

                        }

                        else {


                            removeError(input, $bizDataGrid.find("u-message[u-validatorname = 'requiered']").text().trim());


                        }

                    }


                    if (validators.indexOf("number") != -1) {

                        if (!IsNumeric($(input).val())) {

                            AddError(input, $bizDataGrid.find("u-message[u-validatorname = 'number']").text().trim());

                        }

                        else {


                            removeError(input, $bizDataGrid.find("u-message[u-validatorname = 'number']").text().trim());



                        }

                    }


                    if (validators.indexOf("price") != -1) {

                        if (($(input).val().trim().indexOf("$") == 0)) {

                            if (!IsPriceNumber($(input).val().trim().split("$")[1]))
                                AddError(input, $bizDataGrid.find("u-message[u-validatorname = 'price']").text().trim());



                            removeError(input, $bizDataGrid.find("u-message[u-validatorname = 'price']").text().trim());



                        }

                        else {
                            if (!IsPriceNumber($(input).val().trim()))
                                AddError(input, $bizDataGrid.find("u-message[u-validatorname = 'price']").text().trim());
                            else {


                                removeError(input, $bizDataGrid.find("u-message[u-validatorname = 'price']").text().trim());

                            }

                        }
                    }

                    var customValidators = validators.split(" ");
                    for (var y = 0; y < customValidators.length; y++) {

                        if (typeof (window[customValidators[y]]) == "function") {

                            var result = window[customValidators[y]](input);

                            if (result == false) {
                                AddError(input, $bizDataGrid.find("u-message[u-validatorname = '" + customValidators[y] + "']").text().trim());
                            }

                            else {


                                removeError(input, $bizDataGrid.find("u-message[u-validatorname = '" + customValidators[y] + "']").text().trim());

                            }
                        }
                    }
                }
            }
        }

        function AddError(target, error) {

            //for (var item in _errors) {
            //    if (_errors[item].error == error && _errors[item].entity == $(target).closest("tr").get(0).dataSource && _errors[item].fieldName == $(target).attr("u-datafieldname"))
            //        return;
            //}

            if (target.__hasError)
                return;

            $(target).closest("tr").get(0).dataSource.errors
            $(target).closest("tr").get(0).dataSource.hasErrors = true;
            target.__hasError = true;
            _errors.push({ entity: $(target).closest("tr").get(0).dataSource, fieldName: $(target).attr("u-datafieldname"), error: error });
            showError(target, error);
        }

        function removeError(target, error) {

            for (var x in _errors) {

                if (_errors[x].entity == $(target).closest("tr").get(0).dataSource && _errors[x].fieldName == $(target).attr("u-datafieldname") && _errors[x].error.trim() == error.trim()) {
                    _errors.splice(x, 1);


                    $(target).closest("tr").get(0).dataSource.hasErrors = false;
                    target.__hasError = false;
                    $(target).removeClass("textInputError").addClass("textInput");
                    $(target.errorContainer).remove();
                    target.errorContainer = undefined;
                    $(target).off("click");
                    $(target).off("blur");

                }

            }



        }

        function showError(target, message) {

            var $target = $(target)


            var $error = $("<div class='u-errorBox'/>");


            $error.text(message);
            $target.removeClass("textInput");
            $target.addClass("textInputError");

            $target.on("click", function () {

                if (typeof (target.errorContainer) == "undefined") {
                    target.errorContainer = $error.get(0);
                    $("body").append($error);
                }
                $error.css({ top: $target.offset().top, left: $target.offset().left + $target.get(0).clientWidth });
                $error.show(100);
            });

            $target.on("blur", function () {

                $error.hide(100);
            });

            $(document).on("mousewheel mousedown", function () {

                $error.hide(100);

            });
        }

        this.getItemsInError = function () {


            var items = [];
            for (var x = 0; x < _dataSource.length; x++) {

                if (_dataSource[x].hasErrors)
                    items.push(_dataSource[x]);

            }

            return items;
        }
        //function showError(target, message) {

        //    var $target = $(target)


        //    var $error = $("<div class='u-errorBox'/>");


        //    $error.text(message);
        //    $target.removeClass("textInput");
        //    $target.addClass("textInputError");

        //    $target.on("mouseenter", function () {

        //        if (typeof (this.errorContainer) == "undefined") {
        //            this.errorContainer = $error.get(0);
        //            $("body").append($error);
        //        }
        //        $error.css({ top: $(this).offset().top, left: $(this).offset().left + $(this).get(0).clientWidth });
        //        $error.show(100);
        //    });

        //    $target.on("mouseout", function () {

        //        $error.hide(100);
        //    });

        //}

        function AddTitle() {

            var $title = $("<div class='u-header-title'></div>")
            $title.text(_options.title || $bizDataGrid.attr("u-title") || "");

            if ($bizDataGrid.find("u-titletemplate").length > 0) {
                var $title = $($bizDataGrid.find("u-titletemplate").changeElementType("div")[0]);
                $title.addClass("u-header-title");
            }
            $bizDataGrid.append($title);

        }

        function AddHeader() {

            $header = $("<table  class='BizDataGridHeader'>");

            var $headerRow = $("<tr></tr>");
            $headerRow.css("height", $template.attr("u-headerheight"));

            $template.find("bizdatagrid-columntemplate").each(function (index, value) {

                var $headerColumnTemplate = $(value);

                for (var x = 0; x < _options.columns.length; x++) {

                    if (_options.columns[x].fieldName == $headerColumnTemplate.find("[u-datafieldname]").attr("u-datafieldname")) {
                        //if (_options.columns[$headerColumnTemplate.find("[u-datafieldname]").attr("u-datafieldname")]) {
                        if (_options.columns[x].visible === false) {

                            return;
                        }
                    }

                }


                var $headerColumn = null;
                if ($headerColumnTemplate.find("u-headertemplate").length > 0)
                    $headerColumn = $($headerColumnTemplate.find("u-headertemplate").changeElementType("td")[0]);
                else
                    $headerColumn = $("<td/>");

                $headerColumn.attr("style", $headerColumnTemplate.attr("style"));
                $headerColumn.append($("<div/ class='u-headerText'>").html($headerColumnTemplate.attr("u-headername")));
                $headerColumn.attr("u-headerName", $headerColumnTemplate.find("[u-datafieldname]").attr("u-datafieldname"));
                if ($headerColumnTemplate.attr("u-canfilter") != "false" && $headerColumn.text() != "No.") {


                    var $filterBox = $("<input style='display:none' onkeypress=' var code = event.keyCode || event.which; if(code==13)return false;' class='u-filterbox'/>");
                    //$filterBox.attr("u-filterfieldname", $headerColumnTemplate.attr("u-filterfieldname"));

                    if ($headerColumnTemplate.find("u-filtercollection").length > 0) {

                        var filterValues = []

                        $headerColumnTemplate.find("u-filter").each(function (index, value) {

                            var filter = {};
                            filter.value = $(value).attr("u-value");
                            filter.description = $(value).attr("u-description");

                            filterValues.push(filter);

                        });

                        $filterBox.get(0).haveFilterCollection = true;
                        applyAutoComplete($filterBox, filterValues);

                    }

                    $headerColumnTemplate.find("u-filtercollection").remove();


                    if (typeof ($bizDataGrid.attr("u-filterhandler")) != "undefined") {

                        if ($bizDataGrid.attr("u-filterhandler") in window) {

                            $filterBox.on("keyup", function (e) {

                                code = e.keyCode || e.which;

                                if (code == 13) {

                                    //var fieldName = (_currentFilter && _currentFilter.fieldName) != null ? _currentFilter.fieldName + "," + $headerColumnTemplate.attr("u-filterfieldname") : $headerColumnTemplate.attr("u-filterfieldname");
                                    var fieldName = $headerColumnTemplate.attr("u-filterfieldname");

                                    var filterValue = $(this).attr("value") || $(this).val();
                                    //var filterValue = (_currentFilter && _currentFilter.fieldName) != null ? _currentFilter.filterValue + "," + $(this).attr("value") || $(this).val() : $(this).attr("value") || $(this).val();

                                    var direction = $headerColumn.find(".u-arrows").get(0).currentDirection || "asc";

                                    var filterValues = { fieldName: $headerColumnTemplate.attr("u-filterfieldname"), fieldValue: $(this).attr("value") || $(this).val(),direction:direction };

                                    var filters = [];
                                   
                                    if (_currentFilter != null && _currentFilter.filters) {


                                        filters = _currentFilter.filters;

                                        filters = jQuery.grep(filters, function (n, i) {
                                            return (n.fieldName !== fieldName);
                                        });

                                        filters.push(filterValues);
                                    }

                                    else {

                                        filters.push(filterValues);
                                    }

                                    var args = { fieldName: fieldName, filterValue: filterValue, direction: direction, pageNumber: 1, pageSize: _paginationSize,filters:filters };
                                    _currentFilter = cloneObj(args);

                                    if ($headerColumnTemplate.attr("u-filterhandler") == "local")
                                        filter(args);
                                    else if (typeof (window[$template.find("[u-filterfieldname='" + args.fieldName + "']").attr("u-filterhandler")]) == "function") {
                                        window[$template.find("[u-filterfieldname='" + args.fieldName + "']").attr("u-filterhandler")](args);
                                        _lastFilter = window[$template.find("[u-filterfieldname='" + args.fieldName + "']").attr("u-filterhandler")];
                                    }
                                    else if (typeof (window[$bizDataGrid.attr("u-filterhandler")]) == "function") {
                                        window[$bizDataGrid.attr("u-filterhandler")](args);
                                        _lastFilter = window[$bizDataGrid.attr("u-filterhandler")];
                                    }
                                    else
                                        filter(args);

                                    var imagesPath = $("script[src*='bizDataGrid.js']").attr("src").split('bizDataGrid.js')[0] + "images/";
                                    var $cancelFilter = $("<img class='u-cancelFilter'/>").attr("src", imagesPath + "removeFilter.png");
                                    //$header.find(".u-cancelFilter").remove();
                                    //$cancelFilter.hide();
                                    $filterBox.parents("td").find(".u-cancelFilter").remove();
                                    $filterBox.parents("td").append($cancelFilter);
                                    $(this).blur();

                                    return false;
                                }
                            });
                        }

                        else if ($bizDataGrid.attr("u-filterhandler") == "local"){

                                $filterBox.on("keyup", function (e) {
                                code = e.keyCode || e.which;

                                if (code == 13) {

                                    var fieldName = $headerColumnTemplate.attr("u-filterfieldname");
                                    var filterValue = $(this).attr("value") || $(this).val();
                                    var direction = ($headerColumn.find(".u-arrows").get(0) && $headerColumn.find(".u-arrows").get(0).currentDirection) || "asc";

                                    var args = { fieldName: fieldName, filterValue: filterValue, direction: direction, pageNumber: 1, pageSize: _paginationSize };
                                    _currentFilter = cloneObj(args);

                                    if ($bizDataGrid.attr("u-filterhandler") == "local")
                                        filter(args);

                                    var imagesPath = $("script[src*='bizDataGrid.js']").attr("src").split('bizDataGrid.js')[0] + "images/";
                                    var $cancelFilter = $("<img class='u-cancelFilter'/>").attr("src", imagesPath + "removeFilter.png");
                                    $header.find(".u-cancelFilter").remove();
                                    $filterBox.parents("td").append($cancelFilter);
                                    $cancelFilter.show();

                                    return false;
                                }

                            });


                        }
                    }


                    else if (typeof ($headerColumnTemplate.attr("u-filterhandler")) != "undefined") {

                        if ($headerColumnTemplate.attr("u-filterhandler") in window) {


                            $filterBox.on("keyup", function (e) {

                                code = e.keyCode || e.which;

                                if (code == 13) {

                                    var fieldName = $headerColumnTemplate.attr("u-filterfieldname");
                                    var filterValue = $(this).val();
                                    var direction = $headerColumn.find(".u-arrows").get(0).currentDirection;


                                    var args = { fieldName: fieldName, filterValue: filterValue, direction: direction, pageNumber: 1, pageSize: _paginationSize };
                                    _currentFilter = cloneObj(args);

                                    window[$(value).attr("u-filterhandler")](args);
                                    var imagesPath = $("script[src*='bizDataGrid.js']").attr("src").split('bizDataGrid.js')[0] + "images/";
                                    var $cancelFilter = $("<img class='u-cancelFilter'/>").attr("src", imagesPath + "removeFilter.png");
                                    $header.find(".u-cancelFilter").remove();
                                    $filterBox.parents("td").append($cancelFilter);
                                    $cancelFilter.show();

                                    $(this).blur();

                                    return false;

                                }
                            });
                        }

                        else if ($headerColumnTemplate.attr("u-filterhandler") == "local") {

                            $filterBox.on("keyup", function (e) {

                                code = e.keyCode || e.which;

                                if (code == 13) {

                                    var fieldName = $headerColumnTemplate.attr("u-filterfieldname");
                                    var filterValue = $(this).attr("value") || $(this).val();
                                    var direction = ($headerColumn.find(".u-arrows").get(0) && $headerColumn.find(".u-arrows").get(0).currentDirection) || "asc";

                                    var args = { fieldName: fieldName, filterValue: filterValue, direction: direction, pageNumber: 1, pageSize: _paginationSize };
                                    _currentFilter = cloneObj(args);

                                    if ($headerColumnTemplate.attr("u-filterhandler") == "local")
                                        filter(args);

                                    var imagesPath = $("script[src*='bizDataGrid.js']").attr("src").split('bizDataGrid.js')[0] + "images/";
                                    var $cancelFilter = $("<img class='u-cancelFilter'/>").attr("src", imagesPath + "removeFilter.png");
                                    $header.find(".u-cancelFilter").remove();
                                    $filterBox.parents("td").append($cancelFilter);
                                    $cancelFilter.show();

                                    return false;
                                }

                            });

                        }
                    }

                    else {



                        $filterBox.on("keyup", function (e) {

                            code = e.keyCode || e.which;

                            if (code == 13) {

                                var fieldName = $headerColumnTemplate.attr("u-filterfieldname");
                                var filterValue = $(this).val();
                                var direction = $headerColumn.find(".u-arrows").get(0).currentDirection;


                                var args = { fieldName: fieldName, filterValue: filterValue, direction: direction, pageNumber: 1, pageSize: _paginationSize };
                                _currentFilter = cloneObj(args);

                                setPage(1);
                                var imagesPath = $("script[src*='bizDataGrid.js']").attr("src").replace('bizDataGrid.js', '') + "images/";
                                var $cancelFilter = $("<img class='u-cancelFilter'/>").attr("src", imagesPath + "removeFilter.png");
                                $header.find(".u-cancelFilter").remove();
                                $cancelFilter.hide();
                                $filterBox.parents("td").append($cancelFilter);
                                $(this).blur();

                                return false;

                            }
                        });

                    }


                    $headerColumn.append($filterBox);


                }


                $headerColumn.css({ maxWidth: $headerColumn.get(0).style.width, minWidth: $headerColumn.get(0).style.width });

                if ($headerColumnTemplate.attr("u-cansort") != "false" && $headerColumn.text() != "No.") {


                    var jsFilePath = $("script[src*='bizDataGrid.js']").attr("src").split('bizDataGrid.js')[0];

                    var $arrows = $("<div class='u-arrows'/> ");
                    var $upArrow = $("<img class='u-arrowImage u-upArrow'  />").attr("src", jsFilePath + "images/FlechaArriba.png");
                    var $downArrow = $("<img class='u-arrowImage u-downArrow'/>").attr("src", jsFilePath + "images/FlechaAbajo.png");;

                    $upArrow.click(function () {

                        //$header.find("[src='" + jsFilePath + "images/FlechaArribaVerde.png']").attr("src", jsFilePath + "images/FlechaArriba.png");
                        $header.find("[src='" + jsFilePath + "images/FlechaArriba_azul.png']").attr("src", jsFilePath + "images/FlechaArriba.png");
                        $header.find("[src='" + jsFilePath + "images/FlechaAbajo_azul.png']").attr("src", jsFilePath + "images/FlechaAbajo.png");

                    });

                    $downArrow.click(function () {

                        //$header.find("[src='" + jsFilePath + "images/FlechaArribaVerde.png']").attr("src", jsFilePath + "images/FlechaArriba.png");
                        $header.find("[src='" + jsFilePath + "images/FlechaArriba_azul.png']").attr("src", jsFilePath + "images/FlechaArriba.png");
                        $header.find("[src='" + jsFilePath + "images/FlechaAbajo_azul.png']").attr("src", jsFilePath + "images/FlechaAbajo.png");

                    });


                    if ($headerColumnTemplate.attr("u-filterhandler") == "local") {

                        $upArrow.on("click", function () {
                            //$(this).attr("src", jsFilePath + "images/FlechaArribaVerde.png");
                            $(this).attr("src", jsFilePath + "images/FlechaArriba_azul.png");
                            $downArrow.attr("src", jsFilePath + "images/FlechaAbajo.png");


                            //$downArrow.hide();
                            var fieldName = $headerColumnTemplate.attr("u-filterfieldname");
                            var filterValue = $filterBox.val();
                            var direction = "asc";

                            var args = { fieldName: fieldName, filterValue: filterValue, direction: direction, pageNumber: 1, pageSize: _paginationSize };
                            _currentFilter = cloneObj(args);

                            setPage(1);
                            $arrows.get(0).currentDirection = "asc";
                            //$(this).hide();
                        });

                        $downArrow.on("click", function () {
                            $(this).attr("src", jsFilePath + "images/FlechaAbajo.png");

                            $upArrow.attr("src", jsFilePath + "images/FlechaArriba.png");

                            //$upArrow.show();
                            var fieldName = $headerColumnTemplate.attr("u-filterfieldname");
                            var filterValue = $filterBox.val();
                            var direction = "desc";

                            var args = { fieldName: fieldName, filterValue: filterValue, direction: direction, pageNumber: _currentPage, pageSize: _paginationSize };
                            _currentFilter = cloneObj(args);

                            setPage(1);
                            $arrows.get(0).currentDirection = "desc";
                            //$(this).hide();

                        });
                    }

                    else if (typeof ($bizDataGrid.attr("u-filterhandler")) != "undefined") {

                        if (typeof (window[$bizDataGrid.attr("u-filterhandler")]) == "function") {

                            $upArrow.on("click", function () {


                                //$(this).attr("src", jsFilePath + "images/FlechaArribaVerde.png");
                                $(this).attr("src", jsFilePath + "images/FlechaArriba_azul.png");
                                $downArrow.attr("src", jsFilePath + "images/FlechaAbajo.png");

                                //$downArrow.show();
                                var fieldName = $headerColumnTemplate.attr("u-filterfieldname");
                                var filterValue = $filterBox.val();
                                var direction = "asc";

                                var args = { fieldName: fieldName, filterValue: filterValue, direction: direction, pageNumber: _currentPage, pageSize: _paginationSize };
                                _currentFilter = cloneObj(args);

                                window[$bizDataGrid.attr("u-filterhandler")](args);
                                $arrows.get(0).currentDirection = "asc"
                                //$(this).hide();
                            });

                            $downArrow.on("click", function () {

                                $(this).attr("src", jsFilePath + "images/FlechaAbajo_azul.png");

                                $upArrow.attr("src", jsFilePath + "images/FlechaArriba.png");
                                //$upArrow.show();
                                var fieldName = _currentFilter.fieldName;
                                var filterValue = $filterBox.val();
                                var direction = "desc";

                                var args = { fieldName: $headerColumnTemplate.attr("u-filterfieldname"), filterValue: filterValue, direction: direction, pageNumber: _currentPage, pageSize: _paginationSize };
                                _currentFilter = cloneObj(args);

                                window[$bizDataGrid.attr("u-filterhandler")](args);
                                $arrows.get(0).currentDirection = "desc";
                                //$(this).hide();

                            })

                        }




                    }

                    else if (typeof ($headerColumnTemplate.attr("u-filterhandler")) != "undefined") {

                        if (typeof (window[$headerColumnTemplate.attr("u-filterhandler")]) == "function") {

                            $upArrow.on("click", function () {

                                //$(this).attr("src", jsFilePath + "images/FlechaArribaVerde.png");
                                $(this).attr("src", jsFilePath + "images/FlechaArriba_azul.png");
                                $downArrow.attr("src", jsFilePath + "images/FlechaAbajo.png");

                                //$downArrow.show();
                                var fieldName = $headerColumnTemplate.attr("u-filterfieldname");
                                var filterValue = $filterBox.val();
                                var direction = "asc";

                                var args = { fieldName: fieldName, filterValue: filterValue, direction: direction, pageNumber: _currentPage, pageSize: _paginationSize };
                                _currentFilter = cloneObj(args);

                                window[$headerColumnTemplate.attr("u-filterhandler")](args);
                                $arrows.get(0).currentDirection = "asc";
                                //$(this).hide();
                            });

                            $downArrow.on("click", function () {

                                $(this).attr("src", jsFilePath + "images/FlechaAbajo_azul.png");

                                $upArrow.attr("src", jsFilePath + "images/FlechaArriba.png");

                                //$upArrow.show();
                                var fieldName = $headerColumnTemplate.attr("u-filterfieldname");
                                var filterValue = $filterBox.val();
                                var direction = "desc";

                                var args = { fieldName: fieldName, filterValue: filterValue, direction: direction, pageNumber: _currentPage, pageSize: _paginationSize };
                                _currentFilter = cloneObj(args);

                                window[$headerColumnTemplate.attr("u-filterhandler")](args);
                                $arrows.get(0).currentDirection = "desc";
                                //$(this).hide();

                            });

                        }

                    }


                    else {


                        $upArrow.on("click", function () {
                            //$(this).attr("src", jsFilePath + "images/FlechaArribaVerde.png");
                            $(this).attr("src", jsFilePath + "images/FlechaArriba_azul.png");
                            $downArrow.attr("src", jsFilePath + "images/FlechaAbajo.png");


                            //$downArrow.hide();
                            var fieldName = $headerColumnTemplate.attr("u-filterfieldname");
                            var filterValue = "";

                            if ($filterBox)
                                filterValue = $filterBox.val();

                            var direction = "asc";

                            var args = { fieldName: fieldName, filterValue: filterValue, direction: direction, pageNumber: _currentPage, pageSize: _paginationSize };
                            _currentFilter = cloneObj(args);

                            setPage(1);
                            $arrows.get(0).currentDirection = "asc";
                            //$(this).hide();
                        });

                        $downArrow.on("click", function () {
                            $(this).attr("src", jsFilePath + "images/FlechaAbajo_azul.png");
                            $upArrow.attr("src", jsFilePath + "images/FlechaArriba.png");

                            //$upArrow.show();
                            var fieldName = $headerColumnTemplate.attr("u-filterfieldname");


                            var filterValue = "";
                            if ($filterBox)
                                filterValue = $filterBox.val();

                            var direction = "desc";

                            var args = { fieldName: fieldName, filterValue: filterValue, direction: direction, pageNumber: _currentPage, pageSize: _paginationSize };
                            _currentFilter = cloneObj(args);

                            setPage(1);
                            $arrows.get(0).currentDirection = "desc";
                            //$(this).hide();

                        });


                    }




                    $arrows.append($upArrow);
                    $arrows.append($downArrow);
                    $headerColumn.append($arrows);


                }

                $headerRow.append($headerColumn);
            });

            $headerRow.find(".u-headerText").on("click", function () {

                if (_canFilterAndSort == true) {
                    $headerRow.find("td:not(td:nth-child(" + ($(this).parents("td").index() + 1) + "))").find(".u-filterbox").hide();
                    var $filterBox = $(this).siblings(".u-filterbox");
                    if ($filterBox.is(":hidden"))
                        $filterBox.css("display", "block");
                    $filterBox.focus();

                    $(this).siblings(".u-arrows,.u-cancelFilter").hide();
                }

            });

            $headerRow.find(".u-filterbox").on("blur", function () {

                //if (this.haveFilterCollection == true) {
                //    $(this).focus();
                //    return;
                //}
                if (_canFilterAndSort == true) {
                    if (this.canHide != false) {
                        $(this).hide(200, function () {
                            $(this).siblings(".u-arrows,.u-cancelFilter").show();
                        });

                    }

                    this.canHide = true;
                }
            });

            //$headerRow.find("td").on("mouseleave", function () {
            //    $(this).find(".u-filterbox").hide();
            //    $(this).find(".u-arrows, .u-cancelFilter").show();
            //});



            $bizDataGrid.on("click", ".u-cancelFilter", function () {

                var $headerColumnTemplate = $template.find("bizdatagrid-columntemplate").eq($(this).parents("td").index());
                var filterHandlerName = $bizDataGrid.attr("u-filterhandler") || $headerColumnTemplate.attr("u-filterhandler");
                if (filterHandlerName) {

                    var fieldName = $headerColumnTemplate.find("input").attr("u-datafieldname");

                    //var fieldNames = (_currentFilter && _currentFilter.fieldName.split(",")) || "";
                    //if (_currentFilter && ((_currentFilter && _currentFilter.fieldName.split(",")) || "").indexOf(fieldName) != -1)
                    //{

                    //    fieldNames = jQuery.grep(fieldNames, function (value) {
                    //        return value != fieldName;
                    //    });

                      
                    //}

                    if (_currentFilter && _currentFilter.filters) {
                        _currentFilter.filters = jQuery.grep(_currentFilter.filters, function (value) {
                            return value.fieldName != fieldName;
                        });
                    }
                  
                    _currentFilter =   { fieldName:fieldName, filterValue: null, direction: null, pageNumber: 1, pageSize: _paginationSize,filters:_currentFilter.filters };

                    if (filterHandlerName == "local")
                        filter(_currentFilter)
                    else
                        window[filterHandlerName](_currentFilter);

                }


                else {

                    _currentFilter = { fieldName: null, filterValue: null, direction: null, pageNumber: 1, pageSize: _paginationSize };
                    setPage(1);

                }

                $(this).siblings(".u-filterbox").val("");
                $(this).remove();
            });



            $header.append($headerRow);
            $bizDataGrid.append($header);

        }

        function filter(args) {


            if (_canFilterAndSort == false) {
                return;
            }
            //if (typeof ($bizDataGrid.attr("u-paginationhandler")) != "undefined")
            //    setPage(_currentPage);

            if (typeof ($pager) != "undefined" && _dataSource != null && typeof ($bizDataGrid.attr("u-paginationhandler")) == "undefined") {

                $body.find("tr").remove();
                _removedRows = [];


                _totalPages = getTotalPages();
                $pager.find(".u-endButton").show();
                setPage(1);
            }
            else {
                var filteredData = filterData(args);

                $body.find("tr").remove();
                _removedRows = [];

                bindData(filteredData);
            }

        }

        function getFilteredData() {


            if (filteredData) {

            }

            else {

            }

        }

        function filterData(args) {


            if (!args)
                return _dataSource;

            var filteredData = [];


            var fieldPath = $template.find("[u-datafieldname='" + args.fieldName + "']").attr("u-datafieldpath");
            fieldPath = fieldPath && fieldPath.replace("()", "");

            for (var i in _dataSource) {

                var itemValue;

                if (fieldPath && _dataSource[i][args.fieldName] && fieldPath in _dataSource[i][args.fieldName]) {
                    if (typeof (_dataSource[i][args.fieldName][fieldPath]) == "function")
                        itemValue = _dataSource[i][args.fieldName][fieldPath]();
                    else
                        itemValue = _dataSource[i][args.fieldName][fieldPath];
                }
                else {
                    if (typeof (_dataSource[i][args.fieldName]) == "object")
                        itemValue = (_dataSource[i][args.fieldName]) || "";
                    else
                        itemValue = (_dataSource[i][args.fieldName] && _dataSource[i][args.fieldName].toString()) || "";
                }


                var inputValue;
                if (typeof (window[$template.find("[u-datafieldname='" + args.fieldName + "']").attr("u-valueconverterhandler")]) == "function") {

                    var argsConverter = { value: itemValue, valueToShow: itemValue, lastValue: null, lastValueToShow: null, objectData: _dataSource[i] }
                    window[$template.find("[u-datafieldname='" + args.fieldName + "']").attr("u-valueconverterhandler")](null, argsConverter);
                    inputValue = argsConverter.valueToShow;
                }
                if (itemValue.toUpperCase().indexOf((args.filterValue && args.filterValue.toUpperCase()) || "") != -1
                 || ((inputValue != null && typeof (inputValue) != "undefined") && inputValue.toUpperCase().indexOf((args.filterValue && args.filterValue.toUpperCase()) || "") != -1)) {
                    filteredData.push(_dataSource[i]);
                }
            }


           if (args.direction == "desc")
                filteredData.sort(dynamicSort("-" + args.fieldName, fieldPath));
           if (args.direction == "asc")  
                filteredData.sort(dynamicSort(args.fieldName, fieldPath));
         

            // if (args.direction == "asc")
            //     filteredData.sort(dynamicSort(args.fieldName, fieldPath));
            // else {
            //     filteredData.sort(dynamicSort("-" + args.fieldName, fieldPath));
            // }


            _totalItems = filteredData.length;
            return filteredData;

        }





        function AddBody() {



            $body = $('<table class="BizDataGridBody" />');

            //var $headerRow = $("<tr></tr>");
            //$headerRow.css("height", $template.attr("u-headerheight"));
            //$headerRow.css("max-height", $template.attr("u-headerheight"));
            //$body.css("margin-top", "-" + parseInt($header.find("tr").height(), 10) + "px");
            $body.css("max-height", _options.maxHeight);

            //$template.find("bizdatagrid-columntemplate").each(function (index, value) {

            //    var $headerColumnTemplate = $(value);
            //    var $headerColumn = $("<td/>");
            //    $headerColumn.attr("style", $headerColumnTemplate.attr("style"));
            //    $headerColumn.text($headerColumnTemplate.attr("u-headername"));
            //    $headerColumn.css({ maxWidth: $headerColumn.get(0).style.width, minWidth: $headerColumn.get(0).style.width});

            //    $headerRow.append($headerColumn);


            //});

            //$body.append($headerRow);
            $bizDataGrid.append($body);

            $body.scroll(onScroll);
            $body.on("keydown", onRowKeyUp);


            $body.on("click", "tr", rowClicked);

        }

        function AddPager() {


            var imagesPath = $("script[src*='bizDataGrid.js']").attr("src").split('bizDataGrid.js')[0] + "images/";

            $pager = $("<div class='u-pager'></div>")
            var $buttonContainer = $("<div class='u-pagerButtons'></div>")
            var $buttonPrimero = $("<img/>").attr("src", imagesPath + "BtnInicio.png");
            var $buttonAtras = $("<img/>").attr("src", imagesPath + "BtnAtras.png");
            var $buttonSiguiente = $("<img/>").attr("src", imagesPath + "BtnSiguiente.png");
            var $buttonFin = $("<img class='u-endButton' />").attr("src", imagesPath + "BtnFin.png");

            $buttonContainer.append($buttonPrimero.on("click", function () { paginate("first") }));
            $buttonContainer.append($buttonAtras.on("click", function () { paginate("back") }));
            $buttonContainer.append($("<div class='u-currentPage' readonly='true' >1</div>"));
            $buttonContainer.append($buttonSiguiente.on("click", function () { paginate("next") }));
            $buttonContainer.append($buttonFin.on("click", function () { paginate("last") }));

            if (that.totalPages() == null)
                $buttonFin.hide();

            if ($bizDataGrid.attr("u-fillspace") == "true")
                $pager.css("width", "100%");
            else
                $pager.width($header.width());


            $pager.append($buttonContainer);
            $bizDataGrid.append($pager);
            _currentPage = 1;
            AddRegisters();


            if (typeof ($bizDataGrid.attr("u-totalpages")) != "undefined")
                _userDefinedTotalPages = $bizDataGrid.attr("u-totalpages");

        }

        function AddRegisters() {

            var $registers = $("<div class='u-registers'/>");
            $registers.append($("<span class='u-registersLbl'>Registros</span>"));

            var $registersOptions = $("<select class='u-registersInput' ></select>");
            $registersOptions.append($("<option value='5'>5</option>"));
            $registersOptions.append($("<option value='10'>10</option>"));
            $registersOptions.append($("<option selected = 'selected'  value='20'>20</option>"));
            $registersOptions.append($("<option  value='30'>30</option>"));
            $registersOptions.append($("<option  value='99'>99</option>"));

            //$registersOptions.append($("<option value=50>50</option>"));
            //$registersOptions.append($("<option  value=100>100</option>"));
            //$registersOptions.append($("<option value=200>200</option>"));


            $registers.append($registersOptions.on("change", onRegistersChanged));

            $(".u-header-title", $bizDataGrid).append($registers);

        }

        function onRegistersChanged() {

            if (typeof (that.onRegistersChanging) == "function") {

                that.onRegistersChanging({ pageSize: _paginationSize });
            }
            _paginationSize = this.value;
            setTimeout(function () {
                setPage(1);

                if (typeof (that.onRegistersChanged) == "function") {
                    that.onRegistersChanged({ pageSize: _paginationSize });
                }

            }, 200);



        }

        function paginate(move) {


            if (_canPaginate == false) {
                return;
            }

            var pagina = _currentPage;

            if (move == "next") {


                var totalPages = getTotalPages();
                if (totalPages != null && pagina >= totalPages)
                    ;
                else
                    pagina = _currentPage + 1;

            }

            if (move == "back") {


                pagina = _currentPage - 1;
                if (pagina < 1)
                    return;
            }

            if (move == "first")
                pagina = 1;

            if (move == "last") {

                pagina = getTotalPages();

            }


            setPage(pagina);

        }

        function getTotalPages() {


            if (_userDefinedTotalPages == null && typeof ($bizDataGrid.attr("u-paginationhandler")) == "undefined") {

                var totalPages = parseInt(_totalItems / _paginationSize, 10);

                if (_totalItems % _paginationSize != 0)
                    totalPages += 1;

                return totalPages;
            }

            else if (_userDefinedTotalPages == null && typeof ($bizDataGrid.attr("u-paginationhandler") != "undefined"))
                return null;
            else if (_userDefinedTotalPages != null)
                return _userDefinedTotalPages
        }



        function setPage(page) {


            totalPaginas = getTotalPages();
            if ((page > totalPaginas || page <= 0) && totalPaginas != null)
                return;


            var pageData;

            $body.find("tr").remove();
            _currentPage = page;
            $pager.find(".u-currentPage").text(page);

            if (typeof (window[$bizDataGrid.attr("u-paginationhandler")]) == "function") {



                if (_currentFilter != null) {

                    var fieldName = _currentFilter.fieldName;
                    var filterValue = _currentFilter.filterValue
                    var direction = _currentFilter.direction;

                    window[$($bizDataGrid).attr("u-paginationhandler")]({ fieldName: fieldName, filterValue: filterValue, direction: direction, pageNumber: page, pageSize: _paginationSize,filters:_currentFilter.filters })
                }


                else {

                    window[$($bizDataGrid).attr("u-paginationhandler")]({ fieldName: null, filterValue: null, direction: null, pageNumber: page, pageSize: _paginationSize })

                }

            }

            else {

                pageData = getPageData(page);
                bindData(pageData);
            }




        }


        function getPageData(page) {


            var startIndex = (page - 1) * _paginationSize + 1;
            var endIndex = page * _paginationSize;

            var dataPage = [];
            var data;

            if ((typeof (window[$bizDataGrid.attr("u-filterhandler")]) != "function" && !!_currentFilter && !!_currentFilter.fieldName && typeof (window[$template.find("[u-filterfieldname='" + _currentFilter.fieldName + "']").attr("u-filterhandler")]) != "function") || !!_currentFilter && !!_currentFilter.fieldName && $template.find("[u-filterfieldname='" + _currentFilter.fieldName + "']").attr("u-filterhandler") == "local")
                data = filterData(_currentFilter);
            else
                data = _dataSource;

            for (var x = 0; x < data.length; x++) {

                if (x + 1 >= startIndex && x + 1 <= endIndex) {

                    dataPage.push(data[x]);
                }
            }

            return dataPage;

        }

        function rowClicked() {
            //$(this).parent().find("tr").removeClass("activeRow");
            //$(this).addClass("activeRow");
            that.selectedRow($(this).index());

        }


        var lastSelectedRow = -1;
        this.selectedRow = function (selector) {


            var row;

            if (typeof (selector) == "undefined") {

                row = $body.find(".activeRow").get(0);
            }
            else {

                if (_lockSelectedRow == true && _dataSource.length > 1)
                    return;

                $body.find("tr").removeClass("activeRow");
                row = $body.find("tr").eq(selector).addClass("activeRow").get(0);

            }


            if (typeof (that.onRowSelected) == "function" && lastSelectedRow != row && typeof (selector) != "undefined" && typeof (row) != "undefined")
                that.onRowSelected(row);

            lastSelectedRow = row;
            window.__uLastSelectedGrid = that;
            return row;
        };

        function setRowSelected(selector) {


            var row;

            if (typeof (selector) == "undefined") {

                row = $body.find(".activeRow").get(0);
            }
            else {

                if (_lockSelectedRow == true && _dataSource.length > 1)
                    return;

                $body.find("tr").removeClass("activeRow");
                row = $body.find("tr").eq(selector).addClass("activeRow").get(0);

            }


            //if (typeof (that.onRowSelected) == "function" && lastSelectedRow != row && typeof (selector) != "undefined" && typeof (row) != "undefined")
            //    that.onRowSelected(row);

            lastSelectedRow = row;

            return row;
        }

        this.selectedItem = function () {


            var selectedRow = $body.find(".activeRow");

            if (selectedRow.length > 0)
                return selectedRow.get(0).dataSource;
            else
                return null;
        };

        this.selectedIndex = function () {

            return _dataSource.indexOf(that.selectedItem());
        };

        this.onRowSelected = null;


        function onScroll() {

            var leftPos = $body.get(0).scrollLeft;
            $header.get(0).scrollLeft = leftPos;

            //if (Math.abs($body.get(0).scrollLeft - $header.get(0).scrollLeft) >= 2)
            //    $body.get(0).scrollLeft = $header.get(0).scrollLeft;

        }

        function EqualizeHeaders(contentGrid, HeaderGrid) {


            userHeaderRow = $(contentGrid).find("tr").eq(0);
            var clientRowHeight = userHeaderRow.height();

            $(HeaderGrid).find("tr").eq(0).css("height", clientRowHeight + "px")

            var contentHeaders = $("th", contentGrid);
            $("th", HeaderGrid).each(function (index, header) {

                var headerwidth = contentHeaders.get(index).clientWidth;
                var headerHeader = contentHeaders.eq(index);
                var userwidth = parseInt(headerHeader.css("width"), 10);

                headerHeader.css({ minWidth: userwidth + "px", maxWidth: userwidth + "px" });

                if (headerwidth > userwidth) {
                    $(header).css({ minWidth: headerwidth + "px", maxWidth: headerwidth + "px", width: headerwidth + "px" });
                    // headerHeader.css({ minWidth: headerwidth + "px", maxWidth: headerwidth + "px", width: headerwidth + "px" });
                }

                else {
                    $(header).css({ minWidth: userwidth + "px", maxWidth: userwidth + "px", width: userwidth + "px" });
                    // headerHeader.css({ minWidth: userwidth + "px", maxWidth: userwidth + "px", width: userwidth + "px" });
                }

            });


        }

        this.removedRows = function () {

            return _removedRows;
        };

        this.addRow = function (data, atTop) {


            _canInteract = false;
            var row = _addRow(data, atTop);
            _canInteract = true;


            if (row.dataSource.state != "removed") {
                if (typeof (that.onRowSelected) == "function")
                    that.onRowSelected(row);
                RecalculateColumnWidths();
                if (_canValidate == true)
                    validateGrid();

                _totalItems += 1;
                return row;
            }
            //if (typeof (that.onRowSelected) == "function" && $body.find("tr").length < _paginationSize)


            return null;


        }

        function _addRow(data, atTop) {


            for (var x = 0; x < _options.columns.length; x++) {

                if (_options.columns[x].visible === false)
                    $template.find("[u-datafieldname='" + _options.columns[x].fieldName + "']").parent().remove();
            }

            var row = $template.clone().css("display", "table-row");
            row = $(row.changeElementType("tr"));
            columns = row.find("bizdatagrid-columntemplate").changeElementType("td");

            //$(columns).find("[u-datafieldname='META']")


            row.html("");
            row.append(columns);

            if (_options.readOnly == true) {
                row.find("input").attr("disabled", "disabled");
            }

            if (typeof (data) != "undefined") {


                if (data.state == "removed")
                    return;
                var objs = null;

                if (_dataSource.indexOf(data) == -1) {


                    var fieldNames = getFieldNames();
                    for (var i in fieldNames) {
                        if (!(fieldNames[i] in data))
                            data[fieldNames[i]] = null;
                    }


                    objs = toObjectsWithAccesors([data]);
                    if (atTop)
                        _dataSource.unshift(objs[0]);
                    else
                        _dataSource.push(objs[0]);

                    row.get(0).dataSource = objs[0];
                }

                else {
                    row.get(0).dataSource = data;
                }


                //if (typeof (that.onRowBinding) == "function")
                //    that.onRowBinding(row.get(0));

            }

            else {

                var fieldNames = getFieldNames();
                var obj = {};

                for (var name in fieldNames) {

                    obj[fieldNames[name]] = null;

                }


                var objs = toObjectsWithAccesors([obj]);
                if (atTop)
                    _dataSource.unshift(objs[0]);
                else
                    _dataSource.push(objs[0]);
                row.get(0).dataSource = objs[0];


            }


            //if ($body.find("tr").length >= _paginationSize) {

            //    return row.get(0);
            //}

            if (_showRowNumber == true) {

                var lastNumber = 0;

                if (typeof ($pager) != "undefined") {

                    var lastRow = $("tr", $body).last();

                    if (lastRow.find('.tbRowNumber').length > 0)
                        lastNumber = parseInt(lastRow.index() + 1);

                    var rowNumber = (lastNumber + 1) + ((_currentPage - 1) * _paginationSize);

                    $(row).find(".tbRowNumber").val(rowNumber);

                }


                else {

                    var lastRow = $("tr", $body).last();
                    lastNumber = parseInt(lastRow.find('.tbRowNumber').val());

                    $(row).find(".tbRowNumber").val(lastNumber + 1);

                }


            }


            if (!row.get(0).dataSource.state)
                row.get(0).dataSource.state = "new";



            if (typeof (atTop) == 'undefined')
                atTop = false;

            if (atTop == false)
                $body.append(row);
            else
                $body.prepend(row);

            setRowSelected($(row).index());

           

            var dataFieldInputs = row.find("[u-datafieldname]");
            for (var index = 0; index < dataFieldInputs.length; index++) {


                var value = dataFieldInputs[index];
                var $control = $(value);

                if ($bizDataGrid.attr("u-readonly") == "true")
                    if ($control.attr("u-readonly") != "false")
                        $control.attr("disabled", "disabled");


                var column = null;
                var isReadOnly = null;
                for (var x = 0; x < _options.columns.length; x++) {
                    if ($control.attr("u-datafieldname") == _options.columns[x].fieldName)
                        isReadOnly = _options.columns[x].readOnly;
                }

                if ($control.attr("u-readonly") == "true")
                    $control.attr("disabled", "disabled");

                if (isReadOnly != null) {

                    if (isReadOnly == true) {
                        $control.attr("disabled", "disabled");

                    }
                    if (isReadOnly == false) {

                        $control.removeAttr("disabled");

                    }
                }

                if (typeof ($control.attr("u-datasource")) != "undefined") {

                    if ($control.attr("u-datasource").indexOf("this") != -1) {

                        var source = row.get(0).dataSource[$control.attr("u-datasource").split("this.")[1]];
                        applyAutoComplete($control, source, window[$control.attr("u-onCurrentItemChanged")]);

                    }

                    else {

                        var source = eval($control.attr("u-datasource"));
                        applyAutoComplete($control, source, window[$control.attr("u-onCurrentItemChanged")]);

                    }
                }


                updateControlData($control.attr("u-datafieldname"), $control.parents("tr").get(0).dataSource[$control.attr("u-datafieldname")], $control.parents("tr").get(0).dataSource);


            }


           if (typeof (that.onRowAdded) == "function")
                that.onRowAdded(row);
            if (typeof (that.onRowCollectionChanged) == "function")
                that.onRowCollectionChanged(row);

            //if (data && data.error) {
            //    row.addClass("u-rowinerror");
            //}

            $header.css("overflow-x", "hidden");
            return row.get(0);

        }

        function applyConverter(control) {


            var converterHandler = window[$(control).attr("u-valueconverterhandler")];

            if (typeof (converterHandler) == "function") {

                var args = { value: $(control).attr("value"), valueToShow: $(control).val(), objectData: $(control).parents("tr").get(0).dataSource }

                converterHandler(control, args);
                $(control).attr("value", args.value);
                $(control).val(args.valueToShow);

            }
        }

        this.onFieldBinding;

        this.onRowAdded = null;

        function getFieldNames() {

            var fieldNames = [];
            $template.find("[u-datafieldname]").each(function (index, value) {

                fieldNames.push($(value).attr("u-datafieldname"));

            });

            return fieldNames;
        }

        function onAddRow(row) {



        }

        this.removeRow = function (value) {

            var row;
            if (typeof (value) == "object") {

                for (var i in $body.get(0).rows) {

                    if ($body.get(0).rows[i].dataSource == value) {
                        row = $body.get(0).rows[i];
                        break;
                    }
                }

                if (_dataSource.indexOf(value) != -1)
                    _dataSource.splice(_dataSource.indexOf(value), 1);
            }

            else {


                if (typeof (value) != "undefined") {

                    row = $body.find("tr").get(value);
                }

                else {

                    row = $(".activeRow", $body).get(0);

                }



                if (row)
                    _dataSource.splice($(row).index(), 1);

            }


            if (!row)
                return;


            if ($(row).get(0).dataSource.state != "new") {
                $(row).get(0).dataSource.state = "removed";
                _removedRows.push($(row).detach());
            }
            else {
                $(row).remove();
                _dataSource
            }

            recalculateRowLineNumbers();
            RecalculateColumnWidths();

            if (typeof (that.onRowRemoved) == "function")
                that.onRowRemoved(row, that);


            if ($body.find("tr").length == 0)
                $header.css("overflow-x", "scroll");
            else
                $header.css("overflow-x", "hidden");

            that.selectedRow(0);


            _totalItems -= 1;
            console.log(_totalItems);
            return row;


        }

        this.detachRow = function (value) {

            var row;
            if (typeof (value) == "object") {

                for (var i in $body.get(0).rows) {

                    if ($body.get(0).rows[i].dataSource == value) {
                        row = $body.get(0).rows[i];
                        break;
                    }
                }

                if (value.state == "new")
                    if (_dataSource.indexOf(value) != -1)
                        _dataSource.splice(_dataSource.indexOf(value), 1);
            }

            else {


                if (typeof (value) != "undefined") {

                    row = $body.find("tr").get(value);
                }

                else {

                    row = $(".activeRow", $body).get(0);

                }



                if (row)
                    if ($(row).get(0).dataSource.state == "new")
                        _dataSource.splice($(row).index(), 1);

            }


            if (!row)
                return;



            if ($(row).get(0).dataSource.state != "new") {
                $(row).get(0).dataSource.state = "removed";
                _removedRows.push($(row).detach());
            }
            else {
                $(row).remove();
            }

            recalculateRowLineNumbers();
            RecalculateColumnWidths();

            if (typeof (that.onRowRemoved) == "function")
                that.onRowRemoved(row, that);


            if ($body.find("tr").length == 0)
                $header.css("overflow-x", "scroll");
            else
                $header.css("overflow-x", "hidden");

            that.selectedRow(0);

        }

        this.removeAllRows = function () {

            if (_canUserRemove == false)
                return;

            while ($body.find("tr").length > 0) {

                that.removeRow(0);

            }

        }

        this.onRowRemoved;


        function recalculateRowLineNumbers() {

            $('tr', $body).each(function (index, row) {

                $(row).find(".tbRowNumber").val($(row).index() + 1);

            });
        }

        this.getCurrentPageData = function () {


            var data = [];
            var $rows = $body.find("tr");

            for (var x = 0; x < $rows.length; x++) {
                data.push($rows.get(x).dataSource);
            }

            return data;
        }

        this.onRowCollectionChanged;
        InicializeDataGrid(container, options);
    };




 }(window.bizDataGrid = (window.bizDataGrid || {}), jQuery));

(function ($) {
    $.fn.changeElementType = function (newType) {

        var elements = [];

        $.each(this, function (index, value) {

            var attrs = {};

            $.each(value.attributes, function (idx, attr) {
                attrs[attr.nodeName] = attr.nodeValue;
            });


            elements.push($("<" + newType + "/>", attrs).append($(this).contents())[0]);

        });

        return elements;
    };





})(jQuery);


function IsNumeric(input) {
    var RE = /^-{0,1}\d*\.{0,1}\d+$/;
    return (RE.test(input));
}


function IsPriceNumber(value) {

    var reg = /^\$?[0-9]+(,[0-9]{3})*(\.[0-9]{2})?$/;
    return (reg.test(value));

}


function applyAutoComplete(object, jsondataSource, onSelect) {

    $.each(object, function (index, target) {
        var txt;
        var $target = $(target);
        var dataSource;
        if (typeof (jsondataSource) == "string")
            dataSource = $.parseJSON(jsondataSource);  //dataSource = $.parseJSON('[{"value":"1","description":"description1"},{"value":"2","description":"description2"}]');
        else if (typeof (jsondataSource) == "object")
            dataSource = jsondataSource;
        else {
            dataSource = [{ value: "", description: "" }];
            //return;
        }
        $target.get(0).dataSource = dataSource;
        //var dataSource = $.parseJSON(valuePairJsonListString);
        if (typeof ($target.get(0).dropDownControl) != "undefined")
            $target.get(0).dropDownControl.remove();
        var dropDown = $("<div class='myDropDownList'/>");
        dropDown.css({ display: "none", minHeight: "30px", minWidth: $target.width() + "px", position: "absolute", zIndex: "998", top: ($target.offset().top + $target.height()), left: $target.offset().left });
        dropDown.isActive = false;
        for (var x = 0; x < dataSource.length; x++) {

            var item = $("<div  class='dropDownItem'>" + dataSource[x].description + "</div>");
            item.attr("value", dataSource[x].value);
            item.get(0).dataContext = dataSource[x];

            if ($target.attr("value") == dataSource[x].value) {
                $target.val(dataSource[x].description);
                $target.get(0).selectedItem = dataSource[x];
            }
            dropDown.append(item);
        }
        $target.get(0).dropDownControl = dropDown;
        //$target.get(0).allItems = dropDown;


        var showAll = function () {

            if ($($target.get(0).dropDownControl).find(".dropDownItem").length != $target.get(0).dataSource.length) {

                var dropDown = $target.get(0).dropDownControl;
                $(dropDown).html("");

                for (var x = 0; x < dataSource.length; x++) {

                    var item = $("<div  class='dropDownItem'>" + dataSource[x].description + "</div>");
                    item.attr("value", dataSource[x].value);
                    item.get(0).dataContext = dataSource[x];

                    if ($target.attr("value") == dataSource[x].value) {
                        $target.val(dataSource[x].description);
                        $target.get(0).selectedItem = dataSource[x];
                    }
                    dropDown.append(item);
                }
                $target.get(0).dropDownControl = dropDown;

            }



        };





        $(target).on("focus", function () {

            $(".myDropDownList").hide();

        });

        $target.off("click");
        $target.on("click", function () {


            showAll();


            $(this.dropDownControl).toggle();



            if ($(this.dropDownControl).is(":visible")) {
                dropDown.isActive = true;
                //target.selectedItem = $target.get(0).dataContext;
                $(this.dropDownControl).css("top", ($target.offset().top + $target.height()) + "px");
                $(this.dropDownControl).css("left", $target.offset().left + "px");
                ($target).get(0).select();
            }


        });
        $(dropDown).off("click").on("click", '.dropDownItem', function () {

            console.log("clickclick");
            $target.attr("value", $(this).attr("value"));
            $target.val($(this).text());
            target.selectedItem = this.dataContext;
            $target.change();
            //$target.focus();

            $(dropDown).hide();
            if (typeof (onSelect) == "function")
                onSelect.call($target.get(0), this, $target.get(0));

        });

        $(dropDown).on("mouseleave", function (e) {
            dropDown.isActive = false;
            setTimeout(function () {
                if (dropDown.isActive == false) {
                    $(dropDown).hide();
                }
            }, 250);
            $target.get(0).canHide = true;
        });

        dropDown.on("mouseenter", function () {
            dropDown.isActive = true;
            $target.get(0).canHide = false;
        });

        $target.off("mouseleave");
        $target.on("mouseleave", function (e) {
            dropDown.isActive = false;
            setTimeout(function () {
                if (dropDown.isActive == false) {
                    $(dropDown).hide();
                    showAll();
                    selectAcbValue($target.get(0), $target.attr("value"));

                }
            }, 250);
        });
        $target.off("keyup");
       

        $target.on("keyup", function () {
            if (dropDown.is(":hidden"))
                dropDown.show();
            dropDown.html("");
            var items = "";
            var cont = 0;

            var itemsHolder = [];

            for (var x = 0 ; x < target.dataSource.length; x++) {

                itemValue = target.dataSource[x].description;
                userValue = $target.val();

                if (typeof (itemValue) != "string")
                    itemValue = "";

                if (typeof (userValue) != "string")
                    userValue = "";

                if (itemValue.toUpperCase().indexOf(userValue.toUpperCase()) != -1) {
                    items += "<div class='dropDownItem' value='" + target.dataSource[x].value + "'>" + target.dataSource[x].description + "</div>";
                    itemsHolder.push(target.dataSource[x]);
                }
            }

            dropDown.html(items);
            $target.get(0).dropDownControl = dropDown;
            var dropItems = dropDown.find(".dropDownItem");
            for (var x = 0; x < dropItems.length; x++) {

                dropItems[x].dataContext = itemsHolder[x];

            }

        });

        $target.off("change").on("change", function () {

            if ($(this).val().trim() == "")
                $(this).attr("value", "");

            else {
                if (this.selectedItem)
                    $(this).val(this.selectedItem.description);
                else
                    $(this).val("");
            }

        });

        $("body").append(dropDown);
    });
}

function selectAcbValue(acb, value) {

    $(acb.dropDownControl).find(".dropDownItem").each(function (index, item) {
        if ($(item).attr("value") == value) {
            $(acb).attr("value", $(item).attr("value"));
            acb.selectedItem = item.dataContext;
            $(acb).val($(item).text());
        }
    });
}

function getWidthOfInput(input) {

    $("<span id='width' style='display:inline-block'>").append($(input).val()).appendTo('body');
    var width = ($('#width').get(0).clientWidth + 20);
    $("#width").remove();
    return width;
}



function cloneObj(object) {

    return jQuery.extend(true, {}, object);

}


(function () {


    $(document).ready(function () {

        $("[u-autowidth='true']").each(function (index, value) {
            autoWidth(el);
        });

    });


})();



function autoWidth(el) {


    $(el).on("change", function () {

        var width = getWidthOfElText(this);
        $(this).width(width);
    });


}

function getWidthOfElText(el) {



    var width;
    if ($(el).get(0).tagName == "INPUT") {

        $("<span id='width' style='display:inline-block'>").append($(el).val()).appendTo('body');
        width = ($('#width').get(0).clientWidth + 10);
        $("#width").remove();
    }


    else {

        $("<span id='width' style='display:inline-block'>").append($(el).text()).appendTo('body');
        width = ($('#width').get(0).clientWidth + 10);
        $("#width").remove();

    }

    return width;
}


function dynamicSort(property, path) {
    var sortOrder = 1;
    if (property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }
    return function (a, b) {
        var result = "";

        if (path) {
            if (typeof (a[property][path]) == "function")
                result = ((a[property][path]() || "") < (b[property][path]() || "")) ? -1 : ((a[property][path]() || "") > (b[property][path]() || "")) ? 1 : 0;
            else
                result = ((a[property][path] || "") < (b[property][path] || "")) ? -1 : ((a[property][path] || "") > (b[property][path] || "")) ? 1 : 0;
        }
        else {
            result = ((a[property] || "") < (b[property] || "")) ? -1 : ((a[property] || "") > (b[property] || "")) ? 1 : 0;
        }
        return result * sortOrder;
    }
}

function dynamicSortMultiple() {
    /*
     * save the arguments object as it will be overwritten
     * note that arguments object is an array-like object
     * consisting of the names of the properties to sort by
     */
    var props = arguments;
    return function (obj1, obj2) {
        var i = 0, result = 0, numberOfProperties = props.length;
        /* try getting a different result from 0 (equal)
         * as long as we have extra properties to compare
         */
        while (result === 0 && i < numberOfProperties) {
            result = dynamicSort(props[i])(obj1, obj2);
            i++;
        }
        return result;
    }
}


function AddStyleElement(id, content) {

    var style = document.createElement('style')
    if (id != null)
        style.id = id;
    style.type = 'text/css';
    style.innerHTML = content;
    document.getElementsByTagName('head')[0].appendChild(style);
}





