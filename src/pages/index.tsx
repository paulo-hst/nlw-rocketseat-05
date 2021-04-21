export default function Home(props) {
  return (
    <div>
      <h1>Index</h1>
      <p>{JSON.stringify(props.episodes)}</p>
    </div>
  )
}

export async function getStaticProps() {
  const response = await fetch('http://localhost:3333/episodes')
  const data = await response.json()

  return{
    props: {
      episodes: data,
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