

const getServerSideProps = async (props) => {
    const { req } = props;
    return { header: { hide: true }, footer: { hide: true }, headers: req.headers }
}

const MainArea = (props) => {

    const { headers } = props;
    return <div className="section section-form">
        <h1>Request Headers</h1>
        <ul>
            {_.map(headers, (val, key) => {
                return <li key={key}><b style={{marginRight: 20}}>{key}:</b> {val}</li>
            })}
        </ul>
    </div>
}


export const infoPage = { MainArea, getServerSideProps };