import { useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import 'tailwindcss/tailwind.css';
require('dotenv').config();
export default function Home({ articles }) {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // Ordenar os artigos por data de publicação
    articles.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

    // Calcular o índice inicial e final da lista de notícias para exibir na página atual
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = currentPage * itemsPerPage;

    // Filtrar a lista de notícias com base na página atual
    const currentArticles = articles.slice(startIndex, endIndex);

    // Calcular o número total de páginas
    const totalPages = Math.ceil(articles.length / itemsPerPage);

    // Função para ir para a próxima página
    const nextPage = () => {
        setCurrentPage(prevPage => prevPage + 1);
    };

    // Função para ir para a página anterior
    const prevPage = () => {
        setCurrentPage(prevPage => prevPage - 1);
    };

    // Função para obter o nome do autor ou definir como "Não mencionado"
    const getAuthorName = (article) => {
        if (article.author && article.source && article.author === article.source.name) {
            return 'Não mencionado';
        }
        return article.author;
    };

    return (
        <div className="container mt-5 mx-auto max-w-4xl">
            <h1 className="mb-4 text-3xl font-semibold">Notícias de Elden Ring</h1>
            <div className="grid gap-4">
                {currentArticles.map((article, index) => (
                    <div key={index} className="h-full">
                        <Link legacyBehavior href={article.url}>
                            <a className="block max-w-full p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 h-full relative">
                                <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{article.title}</h5>
                                <p className="mb-2 font-normal text-gray-700 dark:text-gray-400">{article.description}</p>
                                <p className="absolute top-2 right-2 text-sm text-gray-500 dark:text-gray-300">Autor: {getAuthorName(article)}</p>
                                <p className="mb-2 text-sm text-gray-500 dark:text-gray-300">Publicado em: {new Date(article.publishedAt).toLocaleDateString()}</p>
                                <p className="text-gray-500 dark:text-gray-300">Fonte: {article.source.name}</p>
                            </a>
                        </Link>
                    </div>
                ))}
            </div>
            <div className="flex justify-between mt-8">
                <button disabled={currentPage === 1} onClick={prevPage} className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md focus:outline-none">Anterior</button>
                <p className="text-gray-700">{currentPage} de {totalPages}</p>
                <button disabled={endIndex >= articles.length} onClick={nextPage} className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md focus:outline-none">Próxima</button>
            </div>
        </div>
    );
}

export async function getStaticProps() {
    const url = 'https://newsapi.org/v2/everything';
    const params = {
        q: 'Elden ring',
        from: '2023',
        sortBy: 'popularity',
        language: 'pt', // Adicionando o parâmetro para buscar apenas notícias em português
        apiKey: process.env.NEWS_API_KEY    };

    try {
        const response = await axios.get(url, { params });
        const articles = response.data.articles;
        return {
            props: {
                articles
            }
        };
    } catch (error) {
        console.error('Erro ao obter notícias:', error);
        return {
            props: {
                articles: []
            }
        };
    }
}