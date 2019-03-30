$(function () {

    $('#fullPage').fullpage({
        controlArrows: false,
        // navigation: true,
        // navigationPosition: "right",
        navigationColor: "#fff",
        continuousVertical: true,
        // slidesNavigation: false
    });

    var sideBtn = $('.side-btn');   //按钮
    var sidebar = $('.sidebar');   //侧边栏
    var wrapper = $('.wrapper-one'); // 主体内容
    var main = $('.main');
    var isClosed = true;
    //开关侧边栏
    sideBtn.on('click', function () {
        if (isClosed) {
            sideBtn.removeClass("is-closed");
            sideBtn.addClass("is-open");
            sidebar.addClass("active");
            wrapper.addClass("active");
            main.addClass("active");
            isClosed = false;
        } else {
            sideBtn.removeClass("is-open");
            sideBtn.addClass("is-closed");
            sidebar.removeClass("active");
            wrapper.removeClass("active");
            main.removeClass("active");
            isClosed = true;
        }
    });


    //浏览器可是区域高度
    var clientHeight = document.documentElement.clientHeight || document.body.clientHeight;
    var inventoryList = $('.inventory-list');
    var inventoryMsg = [];
    var orderList = [];
    var inventoryScrollLength = 0;

    //统计相同单号
    function countData(datalist) {
        var listArr = [];
        datalist.forEach(function (item, index) {
            for (var i = 0; i < listArr.length; i++) {
                if (listArr[i].orderNum == item.orderNum) {
                    listArr[i].totalSum = listArr[i].totalSum + item.sum;
                    listArr[i].data.push({
                        orderDate: item.orderDate,
                        orderNum: item.orderNum,
                        customerName: item.customerName,
                        sum: item.sum,
                        road: item.road,
                        car: item.car,
                        carType: item.carType,
                        driver: item.driver,
                        state: item.state
                    });
                    return;
                }
            }
            listArr.push({
                totalSum: item.sum,
                orderNum: item.orderNum,
                data: [
                    {
                        orderDate: item.orderDate,
                        orderNum: item.orderNum,
                        customerName: item.customerName,
                        sum: item.sum,
                        road: item.road,
                        car: item.car,
                        carType: item.carType,
                        driver: item.driver,
                        state: item.state
                    }
                ]
            });
        });
        return listArr;
    }

    var InventoryIndex = 0;
    setInterval(function () {
        InventoryIndex++;
        inventoryList.css({
            marginTop: - (clientHeight - 85 - 80) * InventoryIndex + "px",
            transition: "all 3s"
        });
        if (InventoryIndex == inventoryScrollLength) {
            InventoryIndex = 0;
            inventoryList.css({
                marginTop: 0,
                transition: "none"
            });
        }
    }, 5 * 1000);

    function getWareHouse() {
        $.ajax({
            type: "get",
            url: "http://localhost:3003/getInventory",
            dataType: "json",
            success: function (res) {
                if (res.state == '1') {
                    inventoryMsg = res.data;
                    orderList = countData(res.data);
                    inventoryScrollLength = Math.ceil((inventoryMsg.length + orderList.length) / 10);
                    inventoryList.empty();
                    // var total = 0;
                    var s = [];
                    orderList.forEach(function (item, index) {
                        s.push(0);
                        var totalTr = $("<tr>");
                        totalTr.css({ height: (clientHeight - 85 - 80) / 10 + "px" });
                        // totalTr.append("<td>" + "合计" + "</td>" + "<td>" + item.totalSum + "</td>");
                        // totalTr.append("<td colspan='3'>" + "合计" + "</td>" + "<td>" + item.totalSum + "</td>" + "<td colspan='5'>" + "</td>");
                        var td1 = $("<td>");
                        td1.text("合计");
                        var td2 = $("<td>");
                        td2.text(item.totalSum);
                        totalTr.append(td1);
                        totalTr.append(td2);
                        for (var i = 0; i < item.data.length; i++) {
                            s[index] = s[index] + item.data[i].sum;
                            var tr = $("<tr>");
                            tr.css({ height: (clientHeight - 85 - 80) / 10 + "px" });
                            $.each(item.data[i], function (key, value) {
                                var td = $("<td>");
                                td.text(value);
                                tr.append(td);
                            });
                            inventoryList.append(tr);
                            inventoryList.append(totalTr);
                        }
                    });
                    InventoryIndex = 0;
                }
            }
        });
    }

    getWareHouse();
    setInterval(function () { getWareHouse(); }, 20 * 1000);

    var dispatchData = [];
    var dispatchList = $('.dispatch-list');
    var dispatchScrollIndex = 0;
    var dispatchScrollLength = 0;
    setInterval(function () {
        dispatchScrollIndex++;
        dispatchList.css({
            marginTop: -(clientHeight - 85 - 80) * dispatchScrollIndex + "px",
            transition: "all 3s"
        });
        if (dispatchScrollIndex == dispatchScrollLength) {
            dispatchScrollIndex = 0;
            dispatchList.css({
                marginTop: 0,
                transition: "none"
            });
        }
    }, 5 * 1000);
    function getDispatch() {
        $.ajax({
            type: "get",
            url: "http://localhost:3003/getDispatch",
            dataType: "json",
            success: function (res) {
                if (res.state == '1') {
                    dispatchData = res.data;
                    dispatchScrollLength = Math.ceil(dispatchData.length / 10);
                    dispatchData.forEach(function (item, index) {
                        var tr = $("<tr>");
                        tr.css({
                            height: (clientHeight - 85 - 80) / 10 + 'px'
                        });
                        $.each(item, function (key, value) {
                            var td = $("<td>");
                            td.text(value);
                            tr.append(td);
                        });
                        dispatchList.append(tr);
                    });
                }
            }
        });
    }
    getDispatch();


    //车辆派送位置
    var carMap = echarts.init($('#car-map')[0]);
    var planePath = 'path://M1705.06,1318.313v-89.254l-319.9-221.799l0.073-208.063c0.521-84.662-26.629-121.796-63.961-121.491c-37.332-0.305-64.482,36.829-63.961,121.491l0.073,208.063l-319.9,221.799v89.254l330.343-157.288l12.238,241.308l-134.449,92.931l0.531,42.034l175.125-42.917l175.125,42.917l0.531-42.034l-134.449-92.931l12.238-241.308L1705.06,1318.313z';
    new Promise(function (resolve, reject) {
        $.ajax({
            type: "get",
            url: "http://localhost:3003/getComTitleAndAddress",
            dataType: "json",
            success: function (res) {
                if (res.state == '1') {
                    var ComTitleAndAddress = res.data;

                    $('.title').text(ComTitleAndAddress.title);

                    $.ajax({
                        type: "get",
                        url: "http://localhost:3003/getMap",
                        dataType: "json",
                        success: function (res) {
                            echarts.registerMap('provinceMap', res);
                            const geo = {
                                map: 'provinceMap',
                                layoutCenter: ['50%', '50%'],
                                layoutSize: '100%',
                                label: {
                                    normal: {
                                        show: false,
                                        textStyle: {
                                            color: 'none',
                                        }
                                    },
                                    emphasis: {
                                        show: false,
                                        textStyle: {
                                            color: 'none',
                                        }
                                    }
                                },
                                roam: false,
                                itemStyle: {
                                    normal: {
                                        borderColor: '#0ba3ae',
                                        borderWidth: 1,
                                        shadowColor: '#05dcd9',
                                        shadowBlur: 50,
                                        areaColor: '#112246',
                                    },
                                    emphasis: {
                                        areaColor: '#112246'
                                    }
                                }
                            };
                            var option = {
                                geo: geo,
                                series: [
                                    {
                                        name: '车辆派送位置',
                                        type: 'lines',
                                        zlevel: 1,
                                        effect: {
                                            show: true,
                                            period: 6,
                                            trailLength: 0.7,
                                            color: '#fff',
                                            symbolSize: 3
                                        },
                                        lineStyle: {
                                            normal: {
                                                color: '#fff',
                                                width: 0,
                                                curveness: 0.2
                                            }
                                        },
                                        data: []
                                    },
                                    {
                                        name: '车辆派送位置',
                                        type: 'lines',
                                        zlevel: 2,
                                        effect: {
                                            show: true,
                                            period: 6,
                                            trailLength: 0,
                                            symbol: planePath,
                                            symbolSize: 15
                                        },
                                        lineStyle: {
                                            normal: {
                                                color: '#fff',
                                                width: 1,
                                                opacity: 0.4,
                                                curveness: 0.2
                                            }
                                        },
                                        data: []
                                    },
                                    {
                                        name: '车辆派送位置',
                                        type: 'effectScatter',
                                        coordinateSystem: 'geo',
                                        zlevel: 2,
                                        rippleEffect: {
                                            brushType: 'stroke'
                                        },
                                        symbolSize: function (val) {
                                            return val[2] / 8;
                                        },
                                        itemStyle: {
                                            normal: {
                                                color: '#fff'
                                            }
                                        },
                                        data: []
                                    },
                                    // 地图阴影
                                    {
                                        type: 'map',
                                        map: 'provinceMap',
                                        // width: '50%',
                                        layoutCenter: ['50%', '50%'],
                                        layoutSize: '100%',
                                        geoIndex: 1,
                                        aspectScale: 0.75, //长宽比
                                        showLegendSymbol: false, // 存在legend时显示
                                        label: {
                                            normal: {
                                                show: false,
                                            },
                                            emphasis: {
                                                show: false,
                                                textStyle: {
                                                    color: '#fff'
                                                }
                                            }
                                        },
                                        roam: false,
                                        itemStyle: {
                                            normal: {
                                                areaColor: '#112246',
                                                borderColor: '#05dcd9',
                                                borderWidth: 1
                                            },
                                            emphasis: {
                                                areaColor: '#112246'
                                            }
                                        },
                                    }
                                ]
                            };
                            carMap.setOption(option);
                            resolve(ComTitleAndAddress);
                        }
                    });
                }
            }
        });
    }).then(function (result) {
        function getCarLocation() {
            $.ajax({
                type: "get",
                url: "http://localhost:3003/getCarLocation",
                dataType: "json",
                success: function (res) {
                    if (res.status == '1') {
                        var carLocationData = res.data;
                        var carData = [], carGeoCoordMap = {};
                        var address = result.address, title = result.title;
                        var Geo = new BMap.Geocoder();
                        new Promise(function (resolve, reject) {
                            Geo.getPoint(address, function (point) {
                                if (point) {
                                    console.log(point);
                                    carGeoCoordMap[title] = [point.lng, point.lat];
                                    resolve(carGeoCoordMap[title]);
                                }
                            });
                        }).then(function (result) {
                            carLocationData.forEach(function (item, index) {
                                carGeoCoordMap[item.addr] = [item.longitude, item.latitude];
                                carData.push([{ name: title }, { name: item.addr, value: 100 }]);
                            });
                            console.log(carGeoCoordMap);
                            var convertCarData = function (data) {
                                var res = [];
                                for (var i = 0; i < data.length; i++) {
                                    var dataItem = data[i];
                                    var fromCoord = carGeoCoordMap[dataItem[0].name];
                                    var toCoord = carGeoCoordMap[dataItem[1].name];
                                    if (fromCoord && toCoord) {
                                        res.push([{
                                            coord: fromCoord
                                        }, {
                                            coord: toCoord
                                        }]);
                                    }
                                }
                                return res;
                            };

                            carMap.setOption({
                                series: [
                                    {
                                        name: '车辆派送位置',
                                        type: 'lines',
                                        data: convertCarData(carData)
                                    },
                                    {
                                        name: '车辆派送位置',
                                        type: 'lines',
                                        data: convertCarData(carData)
                                    },
                                    {
                                        name: '车辆派送位置',
                                        type: 'effectScatter',
                                        data: carData.map(function (dataItem) {
                                            return {
                                                name: dataItem[1].name,
                                                value: carGeoCoordMap[dataItem[1].name].concat([dataItem[1].value])
                                            };
                                        })
                                    }
                                ]
                            });
                        });

                        console.log(res.data);
                    }
                }
            });
        }
        getCarLocation();
        console.log(result);
    });






























});