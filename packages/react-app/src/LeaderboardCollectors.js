import React, { useState, useEffect } from "react";
import { Link, useLocation, useHistory } from "react-router-dom";
import { useQuery } from "react-apollo";
import { TOP_COLLECTORS_QUERY } from "./apollo/queries";
import { Row, Form, Select } from "antd";
import { Loader, Address } from "./components";
const dayjs = require('dayjs');

const { Option } = Select;

function useSearchParams() {
    let _params = new URLSearchParams(useLocation().search);
    return _params;
  }

export default function Leaderboard(props) {
    let location = useLocation();
    let history = useHistory();
    let searchParams = useSearchParams();

    let [artists, setArtists] = useState([]);
  
    let [orderBy, setOrderBy] = useState('tokenCount');
    let [period, setPeriod] = useState('lastmonth');
    let [createdAt, setCreatedAt] = useState(1596240000);
    let [lastFilterAt, setLastFilterAt] = useState({lastTransferAt_gt: 1596240000})

    const emojifyTop3 = rank => {
        if (rank === 1) {
            return rank + " 🏆";
        } else if (rank === 2) {
            return rank + " 🥈";
        } else if (rank === 3) {
            return rank + " 🥉";
        } else {
            return rank;
        }
    }

    const artistStats = _artists => {
       let artistsPlaceholder = _artists.map(artist => {
            return {
                address: artist.address,
                tokenCount: artist.tokens.length,
                saleCount: artist.sales.length,
                purchaseCount: artist.purchases.length
            }
        })

        switch(orderBy) {
            case 'saleCount':
                setArtists(artistsPlaceholder.sort((a, b) => a.saleCount - b.saleCount).reverse())
                break;
            case 'purchaseCount':
                setArtists(artistsPlaceholder.sort((a, b) => a.purchaseCount - b.purchaseCount).reverse())
                break;
            case "tokenCount":
                setArtists(artistsPlaceholder.sort((a, b) => a.tokenCount - b.tokenCount).reverse())
                break;
            default:
                setArtists(artistsPlaceholder.sort((a, b) => a.tokenCount - b.tokenCount).reverse())
        }
    }



    const { loading, error, data } = useQuery(TOP_COLLECTORS_QUERY, {
        variables: {
            first: 50,
            orderBy: orderBy,
            orderDirection: 'desc',
            createdAt: createdAt,
            filters: lastFilterAt
        }
    });
    
    
    useEffect(() => {
        if (period === "alltime"){
            data ? setArtists(data.users) : console.log("loading");
        } else {
            data ? artistStats(data.users) : console.log("loading");
        }
    }, [data]);
    
    useEffect(() => {
        if (period === "alltime") {
            setCreatedAt(1596240000);
        } else if (period === "lastmonth") {
            setCreatedAt(dayjs().subtract(30, 'days').unix()); 
        }  else if (period === "lastweek") {
            setCreatedAt(dayjs().subtract(7, 'days').unix()); 
            }   
        }
    , [period, setPeriod])

    useEffect(() => {
        let _lastFilterAt;
        if (orderBy === "tokenCount"){
            _lastFilterAt = {lastTransferAt_gt: createdAt}
        } else if (orderBy === "saleCount") {
            _lastFilterAt = {lastSaleAt_gt: createdAt}
        } else if (orderBy === "purchaseCount") {
            _lastFilterAt = {lastPurchaseAt_gt: createdAt}
            }
        setLastFilterAt(_lastFilterAt);
    },[createdAt, setCreatedAt, orderBy, setOrderBy])


    if (loading) return <Loader/>;
    if (error) return `Error! ${error.message}`;
    
    return (
        <div style={{maxWidth: 700, margin: "0 auto", textAlign: "left" }}>
        <Row justify="end" align="center">
            <Form
                layout={"inline"}
                initialValues={{ orderBy: orderBy }}
            >
                <Form.Item name="orderBy">
                    <Select value={orderBy} style={{ width: 120 }} size="large"
                      onChange={(val) => {
                        searchParams.set("orderBy", val)
                        history.push(`${location.pathname}?${searchParams.toString()}`);
                        setArtists([])
                        setOrderBy(val)
                        }
                      }>
                        <Option value="tokenCount">Holdings</Option>
                        <Option value="saleCount">Sale count</Option>
                        <Option value="purchaseCount">Purchase count</Option>
                    </Select>
                </Form.Item>   
            </Form>
            <Form
                layout={"inline"}
                initialValues={{ period: period }}
            >
                <Form.Item name="period">
                    <Select value={period} style={{ width: 120 }} size="large"
                      onChange={(val) => {
                        searchParams.set("period", val)
                        history.push(`${location.pathname}?${searchParams.toString()}`);
                        setArtists([])
                        setPeriod(val)
                        }
                      }>
                        <Option value="alltime">All-time</Option>
                        <Option value="lastmonth">Last 30 days</Option>
                        <Option value="lastweek">Last 7 days</Option>
                    </Select>
                </Form.Item>   
            </Form>
        </Row>
        <Row justify="center">
        <div className="artists-leaderboard">
            <ul>
               { artists.length > 0 ? artists.map((artist, i) => 
               <li key={artist.address} className="artists-leadboard-entry">       
                    <div className="artists-leadboard-entry-rank">
                        <h3>
                            {emojifyTop3(i+1)}
                        </h3>
                    </div>

                    <div className="artists-leadboard-entry-address">
                        <Link
                            to={{pathname: "/artist/"+artist.address}}
                            style={{ color: "black" }}
                        >
                            <Address value={artist.address} ensProvider={props.mainnetProvider} clickable={false} notCopyable={true} />
                        </Link>
                        
                    </div>
                    <div className="artists-leadboard-entry-stats">
                        <p><span role="img" aria-label="Framed Picture">🖼️</span> Total holdings: {artist.tokenCount}</p> 
                        <p><span role="img" aria-label="Framed Picture">💰</span> Sale count: {artist.saleCount}</p> 
                        <p><span role="img" aria-label="Framed Picture">💸</span> Purchase count: {artist.purchaseCount}</p> 
                    </div>
                </li> ) : null }
            </ul>
       </div>
        </Row>                   
            </div>
    )
}
