import getColor from 'utils/getColor'
import NFTCollectionPage from '../../../components/NFTCollectionPage'
import {
  getNFTCollection,
  getNFTCollections,
  getNFTCollectionChartData,
  revalidate,
  getNFTStatistics,
} from '../../../utils/dataApi'

export async function getStaticProps({
  params: {
    collection: [slug],
  },
}) {
  const collection = await getNFTCollection(slug)
  const chart = await getNFTCollectionChartData(slug)
  const statistics = await getNFTStatistics(chart)
  const backgroundColor = await getColor({ protocol: collection.slug, logo: collection.logo })

  return {
    props: {
      collection,
      chart,
      statistics,
      title: collection ? `${collection.name} - DefiLlama` : `DefiLlama - NFT Dashboard`,
      backgroundColor
    },
    revalidate: revalidate(),
  }
}

export async function getStaticPaths() {
  const collections = await getNFTCollections()
  const paths = collections.slice(0, 20).map(({ slug }) => ({
    params: { collection: [slug] },
  }))

  return { paths, fallback: 'blocking' }
}

export default function Collection(props) {
  return <NFTCollectionPage {...props} />
}
