import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ReactPaginate from 'react-paginate';
import './App.css';

const App = () => {
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRows, setSelectedRows] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 10;

    useEffect(() => {
        const fetchProducts = async () => {
            const response = await axios.get('http://localhost:5000/products');
            setProducts(response.data.products);
        };

        fetchProducts();
    }, []);

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
        setCurrentPage(0); // Reset to the first page on search
    };

    const handleRowSelect = (id) => {
        setSelectedRows((prev) =>
            prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
        );
    };

    const handleDelete = (id) => {
        setProducts((prev) => prev.filter((product) => product.id !== id));
    };

    const filteredProducts = products.filter(product =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const displayedProducts = filteredProducts.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);
    const pageCount = Math.ceil(filteredProducts.length / itemsPerPage);

    const handlePageClick = (data) => {
        setCurrentPage(data.selected);
    };

    return (
        <div>
            <h1>Product List</h1>
            <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={handleSearch}
            />
            <div>
                {selectedRows.length > 0 && (
                    <p>{selectedRows.length} row(s) selected</p>
                )}
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Select</th>
                        <th>Product ID</th>
                        <th>Title</th>
                        <th>Price</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {displayedProducts.map(product => (
                        <tr key={product.id} style={{ backgroundColor: selectedRows.includes(product.id) ? 'gray' : 'white' }}>
                            <td>
                                <input
                                    type="checkbox"
                                    checked={selectedRows.includes(product.id)}
                                    onChange={() => handleRowSelect(product.id)}
                                />
                            </td>
                            <td>{product.id}</td>
                            <td>{product.title}</td>
                            <td>${product.price}</td>
                            <td>
                                <button onClick={() => handleDelete(product.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <ReactPaginate
                previousLabel={'<'}
                nextLabel={'>'}
                breakLabel={'...'}
                breakClassName={'break-me'}
                pageCount={pageCount}
                marginPagesDisplayed={2}
                pageRangeDisplayed={3}
                onPageChange={handlePageClick}
                containerClassName={'pagination'}
                activeClassName={'active'}
            />
        </div>
    );
};

export default App;