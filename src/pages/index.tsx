import { GetStaticProps } from 'next' // permite tipagem do método do next
import Image from 'next/image' // performance
import Link from 'next/link' // evita carregamentos redundantes em novas páginas (performance)
import { format, parseISO } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'
import { api } from '../services/api'
import { convertDurationToTimeString } from '../utils/convertDurationToTimeString'

import styles from './home.module.scss'

// tipagem de um episódio
type Episode = {

  id: string;
  title: string;
  thumbnail: string;
  duration: number;
  members: string;
  durationAsString: string;
  publishedAt: string;
  url: string;  

}

// tipagem de vários episódios
type HomeProps = {

  latestEpisodes: Episode[]; // ou Array<Episodes>
  allEpisodes: Episode[]; // ou Array<Episodes>
}

// formatar dados recebidos da API antes de retornar em tela (renderizar)

export default function Home({ latestEpisodes, allEpisodes }: HomeProps) {
  
  return (
    <div className={styles.homePage}>

      <section className={styles.latestEpisodes}>
        <h2>Últimos lançamentos</h2>
        <ul>
          {latestEpisodes.map( episode => {
            return(
              <li key={episode.id}>
                
                <Image
                  width={192} 
                  height={192} 
                  src={episode.thumbnail} 
                  alt={episode.title}
                  objectFit="cover"
                /> 

                <div className={styles.episodeDetails}>
                  <Link href={`/episodes/${episode.id}`}>
                    <a>{episode.title}</a>
                  </Link>
                  <p>{episode.members}</p>
                  <span>{episode.publishedAt}</span>
                  <span>{episode.durationAsString}</span>
                </div>

                <button type="button">
                  <img src="/play-green.svg" alt="Tocar episódio"/>
                </button>

              </li>
            )
          })}
        </ul>
      </section>

      <section className={styles.allEpisodes}>

        <h2>Todos os episódios</h2>

        <table cellSpacing={0}>
          <thead>
            <tr>
              <th></th>
              <th>Podcast</th>
              <th>Integrantes</th>
              <th>Data</th>
              <th>Duração</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {allEpisodes.map(episode => {
              return(
                <tr key={episode.id}>
                  <td style={{ width: 72 }}>
                    <Image 
                      width={120}
                      height={120}
                      src={episode.thumbnail}
                      alt={episode.title}
                      objectFit="cover"                      
                    />
                  </td>
                  <td>
                    <Link href={`/episodes/${episode.id}`}>
                      <a>{episode.title}</a>
                    </Link>
                  </td>
                  <td>{episode.members}</td>
                  <td style={{ width: 100 }}>{episode.publishedAt}</td>
                  <td>{episode.durationAsString}</td>
                  <td>
                    <button type="button">
                      <img src="/play-green.svg" alt="Tocar episódio"/>
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>

      </section>

    </div>
  )

}

export const getStaticProps: GetStaticProps = async () => {

  const { data } = await api.get('episodes', {
    params: {
      _limit: 12,
      _sord: 'published_at',
      _order: 'desc',
    }
  })

  // formatação dos dados (deve-se formatar dados antes de renderizar)
  const episodes = data.map(episode =>{
    return{
      id: episode.id,
      title: episode.title,
      thumbnail: episode.thumbnail,
      members: episode.members, 
      publishedAt: format(parseISO(episode.published_at), ' d MMM yy', { locale: ptBR }),
      duration: Number(episode.file.duration),
      durationAsString: convertDurationToTimeString(Number(episode.file.duration)),
      url: episode.file.url,
    }
  })

  const latestEpisodes = episodes.slice(0 , 2)
  const allEpisodes = episodes.slice(2, episodes.lenght)

  return{
    props: {
      latestEpisodes,
      allEpisodes
    },
    revalidate: 60 * 60 * 8
  }

}

// aula1: #missaoespacial
// aula2: #embuscadoproximonivel

// json-server: api fake para testes (-w: watch / -d: delay / -p: porta)

// SPA: Dificulta o SEO porque os crawlers não esperam o carregamento total da API
// SSR: Utiliza-se a função getServerSideProps para resolver o problema acima. executa TODA vez que tem acesso á pagina
// SSG: Evita carregamento toda vez que acessa a página, evita requisições desnecessárias. mais performance

// revalidade: tempo de regarregamento, gerando uma nova versão da página (nova chamada API)