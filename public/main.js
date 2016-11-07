'use strict';
const s+ function(){
const s = $('#search').val();
    $.ajax({
        url: "/todos",
        method: "get",
        dataType: "json",
        data: {s: s},
        success: function (tvyal) {
            $("ul").html('');
            tvyal.items.forEach(function (item) {
                let htm = $("<li id = '"+item.id+"'>" + item.message +
                    "<input onclick = 'updating(this)' type ='checkbox'>" +
                    "<button onclick = 'deleting(this)'>Delete</button></li>");
                let checker = htm.find("input");
                checker.prop("checked", item.checked);
                $("ul").append(htm);
            });
        },
        error: function (problem) {
            alert("Problem occured");
        }
    });
};

const creating = function(){
    const mes = $('#create').val();
    if(mes !== ''){
        $.ajax({
            url: "/create",
            method: "post",
            dataType: "json",
            data: JSON.stringify({
                message   : mes,
                completed : false
            }),
            success: function (tvyal) {
                searching();
                $('#create').val('');
            },
            error: function (problem) {
                alert("Problem occured");
            }
        });
    }
};
const updating = function(todo){
    let todoid = $(todo).parent().attr('id');
    alert(todoid);
    $.ajax({
        url         : "/update/" + todoid,
        type        : 'put',
        dataType    : 'text',
        contentType : "application/json; charset=utf-8",
        success     : function(tvyal) {
            searching();
        },
        error       : function(tvyal) {
            alert('Problem occured');
        }
    });

};

const deleting = function(todo){
    let todoid = $(todo).parent().attr('id');
    $.ajax({
        url     : "/delete/" + todoid,
        type : 'delete',
        success : function(tvyal) {
            searching();
        },
        error: function (problem) {
            alert("error occured");
        }
    });
};
searching();