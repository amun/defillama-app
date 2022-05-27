import ProtocolContainer from 'containers/ProtocolContainer'
import { standardizeProtocolName } from 'utils'
import { getProtocols, getProtocol, fuseProtocolData, revalidate } from 'utils/dataApi'
import getColor from 'utils/getColor'

export async function getStaticProps({
  params: {
    protocol: [protocol],
  },
}) {
  const protocolRes = await getProtocol(protocol)

  if (!protocolRes || protocolRes.statusCode === 400) {
    return {
      notFound: true,
    }
  }

  delete protocolRes.tokensInUsd
  delete protocolRes.tokens

  const protocolData = fuseProtocolData(protocolRes, protocol)

  const backgroundColor = await getColor({ protocol, logo: protocolData.logo })

  return {
    props: {
      protocol,
      protocolData,
      backgroundColor,
    },
    revalidate: revalidate(),
  }
}

export async function getStaticPaths() {
  const res = await getProtocols()

  const paths = res.protocols.slice(0, 30).map(({ name }) => ({
    params: { protocol: [standardizeProtocolName(name)] },
  }))

  return { paths, fallback: 'blocking' }
}

export default function Protocols({ protocolData, ...props }) {
  return (
    <ProtocolContainer
      title={`${protocolData.name}: TVL and stats - DefiLlama`}
      protocolData={protocolData}
      {...props}
    />
  )
}
