$('#dowebok').fullpage({
    controlArrows: false,
    // navigation: true,
    // navigationPosition: "right",
    navigationColor: "#fff",
    continuousVertical: true,
    // slidesNavigation: false
});

//浏览器可是区域高度
var clientHeight = document.documentElement.clientHeight || document.body.clientHeight;
var index = 0;
// var tb = $('.table-body');
var inventoryList = $('.inventory-list');
var inventoryData = [];

setInterval(function () {
    index++;
    inventoryList.css({
        marginTop: -(clientHeight - 85 - 80) * index + "px",
        transition: "all 3s"
    });
    if (index == Math.ceil(result.length / 10)) {
        setTimeout(function () {
            index = 0;
            inventoryList.css({
                marginTop: 0 + "px",
                transition: "none"
            });
        }, 4000);
    }
}, 6000);

function getInventory() {
    $.ajax({
        type: "get",
        url: "http://localhost:3003/getInventory",
        dataType: "json",
        success: function (res) {
            inventoryData = res.data.inventory;
            inventoryData.forEach(function (item, index) {
                var tr = $('<tr>');
                tr.css({
                    height: (clientHeight - 85 - 80) / 10 + 'px'
                });
                tr.append("<td>" + item.warehouse + "</td>" + "<td>" + item.specification + "</td>" + "<td>" + item.num + "</td>" + "<td>" + item.remark + "</td>");
                inventoryList.append(tr);
            });
            var concatEmpty = 10 - inventoryData.length % 10;
            for (var i = 0; i < concatEmpty; i++) {
                var tr = $('<tr>');
                tr.css({
                    height: (clientHeight - 85 - 80) / 10 + 'px'
                });
                inventoryList.append(tr);
            }
            inventoryData.slice(0, 10).forEach(function (item, index) {
                var tr = $('<tr>');
                tr.css({
                    height: (clientHeight - 85 - 80) / 10 + 'px'
                });
                tr.append("<td>" + item.warehouse + "</td>" + "<td>" + item.specification + "</td>" + "<td>" + item.num + "</td>" + "<td>" + item.remark + "</td>");
                inventoryList.append(tr);
            });
        }
    });
}
getInventory();


function getDispatch() {
    $.ajax({
        type: "get",
        url: "http://localhost:3003/getDispatch",
        dataType: "json",
        success: function (res) {

        }
    });
}
