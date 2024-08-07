const { nanoid } = require("nanoid");
const bookshelf = require("./bookshelf");

const addBookInfoHandler = (request, header)=>{
    const {

        name, year, author, summary, publisher, pageCount, readPage, reading,

    } = request.payload;

    if (!name){
        const response = header.response({
            status:'fail',
            message:'Gagal menambahkan buku. Mohon isi nama buku'
        })
        response.code(400);
        return response;
    }
    if(readPage > pageCount){
        const response = header.response({
            status:'fail',
            message:'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
        })
        response.code(400);
        return response;
    }

    const id = nanoid(16);
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;
    const finished = pageCount === readPage;

    const newBook = {
        id,name,year,author,summary,publisher,pageCount, readPage, finished, reading ,insertedAt,updatedAt
    }
    bookshelf.push(newBook);

    const isSuccess = bookshelf.filter(book => book.id === id).length > 0;
    if (isSuccess){
    const response = header.response({
        status:'success',
        message: 'Buku berhasil ditambahkan',
        data: {
            bookId: id
        },
    })
    response.code(201);
    return response;
    }

    const response = header.response({
        status:'fail',
        message: 'Buku gagal ditambahkan'
    })
    response.code(500);
    return response;
}

const getAllBookInfoHandler = (request, header) => {

    const {name, reading, finished } = request.query;
    if (name !== undefined){
        const response = header.response({
            status:'success',
            data:{
                books: bookshelf.filter(book => book.name.toLowerCase().includes(name.toLowerCase())).map((book) => ({
                    id:book.id,
                    name: book.name,
                    publisher: book.publisher,
                })),
            },
        });
        response.code(200);
        return response;
    }
    if (reading !== undefined){
        const response = header.response({
            status:'success',
            data:{
                books: bookshelf.filter(book => book.reading == reading).map((book) => ({
                    id:book.id,
                    name: book.name,
                    publisher: book.publisher,
                })),
            },
        });
        response.code(200);
        return response;
    }

    if (finished !== undefined){
        const response = header.response({
            status:'success',
            data:{
                books: bookshelf.filter(book => book.finished == finished ).map((book) => ({
                    id:book.id,
                    name: book.name,
                    publisher: book.publisher,
                })),
            },
        });
        response.code(200);
        return response;
    }

    const response = header.response({
        status:'success',
        data:{
            books: bookshelf.map((book)=>({
                id:book.id,
                name: book.name,
                publisher:book.publisher
            })),
        },
    });
    response.code(200);
    return response;
}
const getDetailedBookInfoHandler = (request, header) => {
    const { id } = request.params;
    const book = bookshelf.filter(b => b.id === id)[0];
    if (book !== undefined){
        const response = header.response({
            status:'success',
            data:{
                book,
            },
        });
        response.code(200);
        return response;
    }else{
    const response = header.response({
        status:'fail',
        message:'Buku tidak ditemukan'
});
    response.code(404);
    return response;

}}
const editBookInfoHandler= (request,header)=> {
    const {id} = request.params;
    const {

        name, year, author, summary, publisher, pageCount, readPage, reading,

    } = request.payload;
    const updatedAt = new Date().toISOString();
    const bookIndex = bookshelf.findIndex(book => book.id === id);

    if (!name){
        const response = header.response({
            status:'fail',
            message:'Gagal memperbarui buku. Mohon isi nama buku'
        })
        response.code(400);
        return response;
    }
    if(readPage > pageCount){
        const response = header.response({
            status:'fail',
            message:'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
        })
        response.code(400);
        return response;
    }

    if(bookIndex !== -1){
        const finished = pageCount === readPage;
        bookshelf[bookIndex] = {
            ...bookshelf[bookIndex],
            name,
            year,
            author,
            summary,
            publisher,
            pageCount,
            readPage,
            finished,
            reading,
            updatedAt
        }
        const response = header.response({
            status:'success',
            message:'Buku berhasil diperbarui'
        });
        response.code(200);
        return response;
        }
        const response = header.response({
            status:'fail',
            message:'Gagal memperbarui buku. Id tidak ditemukan'
        });
        response.code(404);
        return response;
        
        
}

const deleteBookInfoHandler = (request, header) => {
    const { id } = request.params;
    const bookIndex = bookshelf.findIndex(book => book.id === id);

    if (bookIndex !== -1){
        bookshelf.splice(bookIndex,1);
        const response = header.response({
            status:'success',
            message:'Buku berhasil dihapus'
        });
        response.code(200);
        return response;
    }
    const response = header.response({
        status:'fail',
        message:'Buku gagal dihapus. Id tidak ditemukan'
    });
    response.code(404);
    return response;
    
}

module.exports = {addBookInfoHandler,getAllBookInfoHandler,getDetailedBookInfoHandler,editBookInfoHandler, deleteBookInfoHandler};