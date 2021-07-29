import React, { useState, useEffect } from "react";
import { Link, useLocation, useHistory } from "react-router-dom";
import { useQuery } from "react-apollo";
import { TOP_ARTISTS_QUERY } from "./apollo/queries";
import { Row, Form, Select, Tabs } from "antd";
import { Loader, Address } from "./components";
import LeaderboardCollectors from "./LeaderboardCollectors";
const { TabPane } = Tabs;
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
  
    let [orderBy, setOrderBy] = useState(searchParams.get("orderBy") || 'earnings');
    let [period, setPeriod] = useState(searchParams.get("period") || 'lastmonth');
    let [createdAt, setCreatedAt] = useState(1596240000);
    let [lastFilterAt, setLastFilterAt] = useState({lastSaleAt_gt: 1596240000})

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
                earnings: artist.sales.map(e => parseInt(e.price)).reduce((a,b) => a+b, 0),
                likeCount: artist.likes.length,
                inkCount: artist.inks.length
            }
        })

        switch(orderBy) {
            case 'earnings':
                setArtists(artistsPlaceholder.sort((a, b) => a.earnings - b.earnings).reverse())
                break;
            case 'likeCount':
                setArtists(artistsPlaceholder.sort((a, b) => a.likeCount - b.likeCount).reverse())
                break;
            case "inkCount":
                setArtists(artistsPlaceholder.sort((a, b) => a.inkCount - b.inkCount).reverse())
                break;
            default:
                setArtists(artistsPlaceholder.sort((a, b) => a.earnings - b.earnings).reverse())
        }
    }

    const { loading, error, data } = useQuery(TOP_ARTISTS_QUERY, {
        variables: {
            first: 50,
            skip: 0,
            orderBy: orderBy,
            orderDirection: 'desc',
            createdAt: createdAt,
            filters: lastFilterAt
        }
    });
    
    
    useEffect(() => {
        if (period === "alltime"){
            data ? setArtists(data.artists) : console.log("loading");
        } else {
            data ? artistStats(data.artists) : console.log("loading");
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
        if (orderBy === "earnings"){
            _lastFilterAt = {lastSaleAt_gt: createdAt}
        } else if (orderBy === "likeCount") {
            _lastFilterAt = {lastLikeAt_gt: createdAt}
        } else if (orderBy === "inkCount") {
            _lastFilterAt = {lastInkAt_gt: createdAt}
            }
        setLastFilterAt(_lastFilterAt);
    },[createdAt, setCreatedAt, orderBy, setOrderBy])

    if (loading) return <Loader/>;
    if (error) return `Error! ${error.message}`;
    
    return (
        <Tabs defaultActiveKey="1" centered={true} style={{textAlign:'center'}}>
            <TabPane tab="Artists" key="1">
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
                                    <Option value="earnings">Sales</Option>
                                    <Option value="likeCount">Likes</Option>
                                    <Option value="inkCount">Inks count</Option>
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
                                        <p><span role="img" aria-label="Dollar Sign">💲</span> Earnings: ${(parseInt(artist.earnings) / 1e18).toFixed(2)}</p>
                                        <p><span role="img" aria-label="Framed Picture">🖼️</span> Total Inks: {artist.inkCount}</p> 
                                        <p><span role="img" aria-label="Thumbs Up">👍</span> Total likes: {artist.likeCount}</p>
                                    </div>
                                </li> ) : null }
                            </ul>
                        </div>
                    </Row>                   
                </div>
            </TabPane>
            <TabPane tab="Collectors" key="2">
                <LeaderboardCollectors />
            </TabPane>
        </Tabs>
        
    )
}
