import { GetStaticProps } from 'next';
import Head from 'next/head';
import { getPrismicClient } from '../../services/prismic';
import styles from './styles.module.scss';
import Prismic from '@prismicio/client';
import {RichText} from 'prismic-dom'
import Link from 'next/link';

type Post = {
  slug: string;
  title: string;
  excerpt: string;
  updatedAt: string;
}

interface PostProps {
  posts: Post[];
}

export default function Posts({ posts }: PostProps) {
  return (
    <>
      <Head>
        <title>Posts | Ignews</title>
      </Head>

      <main className={styles.container}>
        <div className={styles.posts}>
          {posts?.map((post) => (
            <Link key={post.slug} href={`https://ignite-desafio-09-deploy-7vlfkkz6b-tiagosn01.vercel.app/posts/${post.slug}`}>
            <a>
              <time>{post.updatedAt}</time>
              <strong>{post.title}</strong>
              <p>{post.excerpt}</p>
            </a>
            </Link>
          ))}       
        </div>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient()

  const response = await prismic.query([
    Prismic.predicates.at('document.type', 'tests')
  ], {
    fetch: ['tests.title', 'tests.content'],
    pageSize: 100,
  })

  const {next_page, results} = response;
  console.log(results)
  const posts = results.map((post) => {
    return {
      slug: post.uid,
      title: RichText.asText(post.data?.title),
      excerpt: post.data.content.find((content) => content.type==='paragraph')?.text ?? '',
      updatedAt: new Date(post.last_publication_date).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      })    
    }
  })
  return {
    props: {
        posts: posts,  
    },
  }
}