// make creates our URL fragments and rules for rewriting URLs for auth
export function make(token, server = "github.com", prefix = "") {
    prefix = prefix.replace(/^\/+/, "")
    return {
        auth_rule: `url.https://x-access-token:${token}@${server}/${prefix}.insteadof`,
        auth_url: `https://x-access-token:${token}@${server}/${prefix}`,
        https_url: `https://${server}/${prefix}`,
        section: `url.https://x-access-token:${token}@${server}/${prefix}`,
        ssh_url: `git@${server}:${prefix}`,
    }
}
