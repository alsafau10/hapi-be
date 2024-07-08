const { addBookInfoHandler, getAllBookInfoHandler, getDetailedBookInfoHandler, editBookInfoHandler, deleteBookInfoHandler } = require("./handler");

const routers = [
    {
        method:'POST',
        path:'/books',
        handler: addBookInfoHandler,
    },
    {
        method:'GET',
        path:'/books',
        handler: getAllBookInfoHandler,
    },
    {
        method:'GET',
        path:'/books/{id}',
        handler:getDetailedBookInfoHandler,
    },
    {
        method:'PUT',
        path:'/books/{id}',
        handler: editBookInfoHandler,
    },
    {
        method:'DELETE',
        path:'/books/{id}',
        handler: deleteBookInfoHandler,
    }
];

module.exports = routers;