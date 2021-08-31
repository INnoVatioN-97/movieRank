import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import { Grid, Paper } from '@material-ui/core';
import { Link } from 'react-router-dom';
// firebase login import 추가
import 'firebase/firestore';
import 'firebase/auth';
import '../css/Home.css';

//https://material-ui.com/system/flexbox/#flex-wrap 에서
// Box 좀 보고 Home 화면에서 순위 세개 이쁘게 띄워야 함.

const useStyles = makeStyles({
    pageTitle: {
        textAlign: 'center',
        fontSize: '4.2rem',
        marginTop: 15,
        marginBottom: 15,
    },
    top3List: {
        listStyle: 'none',
        justifyContent: 'center',
    },
    box: {
        display: 'flex',
        flexWrap: 'nowrap',
        p: 1,
        m: 1,
        backgroundColor: '#f2f2f2',
        sx: { maxWidth: 300 },
    },
});

const Home = ({ movies, isLoggedIn, userObj, tmdbHome }) => {
    const classes = useStyles();
    const tmdbPosterURL = 'https://image.tmdb.org/t/p/w500';
    const tmdbViewURL = '/viewTmdb/';
    const kobisViewURL = '/viewMovie?movieNm=';

    const printTop3Movies_KOBIS = () => {
        return (
            <div className="childs">
                <div>
                    <h2>박스오피스 (국내)</h2>
                </div>
                <Grid container spacing={3} align="center">
                    {movies.map((m) => (
                        <>
                            <Grid item xs={4}>
                                <Link to={kobisViewURL + m.title}>
                                    <img className="posters" src={m.image} alt={m.title} />
                                </Link>
                                <span className="texts">
                                    <h3>
                                        {m.rank}위 {m.title}
                                    </h3>
                                </span>
                            </Grid>
                        </>
                    ))}
                </Grid>
            </div>
        );
    };

    const printTop3Movies_TMDB = () => {
        return (
            <div className="childs">
                <div>
                    <h2>박스오피스 (해외)</h2>
                </div>
                <Grid container spacing={3} align="center">
                    {tmdbHome.slice(0, 3).map((tmdb) => (
                        <Grid item xs={4}>
                            <Link to={tmdbViewURL + tmdb.id}>
                                <img
                                    className="posters"
                                    src={tmdbPosterURL + tmdb.backdrop_path}
                                    alt={tmdb.title}
                                />
                            </Link>
                            <span className="texts">
                                <h3>{tmdb.title}</h3>
                            </span>
                        </Grid>
                    ))}
                </Grid>
            </div>
        );
    };

    return (
        <>
            <div className={classes.pageTitle}>어제의 Top 3 영화들</div>
            <Box className={classes.box}>{printTop3Movies_KOBIS()}</Box>
            <Box className={classes.box}>{printTop3Movies_TMDB()}</Box>
        </>
    );
};
export default Home;
