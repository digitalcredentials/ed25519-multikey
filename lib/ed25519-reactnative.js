import * as ed25519 from '@stablelib/ed25519'

const modifiedSha256Digest = ({data}) => {
    return ed25519.sha256digest(data)
}

export default {
  ...ed25519,
  sha256digest: modifiedSha256Digest
}
