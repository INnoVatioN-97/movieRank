import React from 'react';
import axios from 'axios';
import { withStyles } from '@material-ui/styles';
import { TableHead, TableBody, TableCell, Table, TableRow, TextField } from '@material-ui/core';
import { dbService } from 'fbase';

const cheerio = require('cheerio');

const styles = (theme) => ({
    table: {
        alignItem: 'center',
        marginLeft: 20,
        marginRight: 20,
        width: 500,
    },
    image: {
        minWidth: 480,
        maxWidth: 720,
        height: 550,
    },
    alignItem: {
        justifyContent: 'center',
    },
});

class ViewMovie extends React.Component {
    // const { params } = this.props.match;
    state = { isLoading: true, movies: [], value: '' };

    // await axios.get('/api/v1/search/movie.json', {
    //     params: { query: search, display: 5 },
    //     headers: { 'X-Naver-Client-Id': ID_KEY, 'X-Naver-Client-Secret': SECRET_KEY },
    // });

    getHTML = async (code) => {
        try {
            console.log(`code from getHTML: ${code}`); //정확히 전달 됨.
            return await axios.get('/poster/movie/bi/mi/photoViewPopup.naver?movieCode=' + code);
        } catch (error) {
            console.error(error);
        }
    };

    // 가져온 movies속 link에서 영화코드만 따로 뽑아 고화질 영화 포스터를 추출하는 함수로 할 예정.
    getMovieImage = () => {
        const movie = this.state.movies;
        let highQualityPoster = '';
        // console.log('movie[0]', movie[0]);

        //하드코딩이지만 일단 영화정보에서 네이버 영화검색 결과창 주소를 가져와 거기서 영화코드를 추출.
        const codes = movie[0].link.split('?code='); //정상적으로 코드 얻어오는것 확인됨.
        const code = codes[1];
        this.getHTML(code)
            .then((res) => {
                // console.log(`html: ${res}`);
                let $ = cheerio.load(res.data);
                // console.log('html.data: ', res.data);
                // ul.list--posts를 찾고 그 children 노드를 bodyList에 저장
                const bodyList = $('#page_content').children('a').children('#targetImage');
                highQualityPoster = bodyList[0].attribs.src;
                // console.log('hqPoster from getHtml(line94):', highQualityPoster);
                if (highQualityPoster !== undefined) {
                    this.setState({ hqPoster: highQualityPoster, isLoading: false });
                    return;
                }
            })
            .catch((err) => {
                console.log(err);
            });
    };

    //네이버 검색 API에서 영화 검색 정보를 가져오는 비동기 함수
    getSearchMovie = async () => {
        const ID_KEY = process.env.REACT_APP_NAVER_CLIENT_ID;
        const SECRET_KEY = process.env.REACT_APP_NAVER_CLIENT_SECRET_KEY;
        const search = this.props.movieNm;
        try {
            if (search === '') {
                this.setState({ movies: [], isLoading: false });
            } else {
                const {
                    data: { items },
                } = await axios.get('/api/v1/search/movie.json', {
                    params: { query: search, display: 5 },
                    headers: { 'X-Naver-Client-Id': ID_KEY, 'X-Naver-Client-Secret': SECRET_KEY },
                });
                //주소를 통해 가져와 진 items 배열을 movies라는 state에 저장.
                // this.setState({ movies: items, isLoading: false });
                this.setState({ movies: items });
                this.getMovieImage();
            }
            //  this.getMovieImage();
        } catch (error) {
            console.log(error);
        }
    };

    componentDidMount() {
        //render() 함수가 실행되기 전 미리 api를 불러 영화 정보를 가져온다.
        this.getSearchMovie();
        //  this.getMovieImage();
    }

    render() {
        // state에 저장된 내용들 중 아까 26번 줄에서 저장한 movies, isLoading을 가져와 const 변수에 저장.
        const { movies, isLoading, hqPoster } = this.state;
        // console.log(movies);
        const { classes } = this.props;
        const printActors = (actors) => {
            let text = '';
            for (let i = 0; i < actors.length - 1; i++) {
                if (actors[i] === '') continue;
                if (i === actors.length - 2) text += actors[i];
                else text += actors[i] + ',';
            }
            return text;
        };
        const handleChange = (e) => {
            this.setState({ comment: e.target.value });
            // console.log(`comment: ${e.target.value}`);
            // e.target.value = '';
        };

        const addComment = (e) => {
            if (e.keyCode === 13) {
                console.log(`addComment : ${this.state.comment}`);
                // document.getElementById('commentField').innerText = '';
                this.setState({ comment: '' });
            }
        };
        const printMovieInfo = (mv) => {
            const movie = mv[0];
            const actors = movie.actor.split('|');

            // console.log('movie from printMovieInfo:', movie);
            const code = movie.link.split('?code=')[1];
            // console.log('code from printMovieInfo:', code);

            // console.log('movie: ', movies);
            // this.getMovieImage(movies);
            return (
                <TableBody>
                    <TableRow>
                        <TableCell colSpan="4" className={classes.alignItem}>
                            <a href={movie.link} rel="norefferer">
                                {/* {this.getMovieImage(movies, classes.image)} */}
                                {console.log('hqPoster', hqPoster)}
                                <img className={classes.image} src={hqPoster} alt={movie.title} />
                            </a>
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell colSpan="4">{movie.title.replace(/<b>/gi, '').replace(/<\/b>/gi, '')}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell colSpan="2">개봉: {movie.pubDate}</TableCell>
                        <TableCell>평점: {movie.userRating}</TableCell>
                        <TableCell>감독: {movie.director.replace('|', '')}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>출연진</TableCell>
                        <TableCell colSpan="3">{printActors(actors)}</TableCell>
                    </TableRow>
                    <TableRow>
                        {/* <form className={classes.commentForm} noValidate autoComplete="off"> */}
                        <TableCell colSpan="4">
                            {/* <TextField id="outliend-basic" label="한줄평 남기기" variant="outlined" /> */}
                            <TextField
                                id="commentField"
                                fullWidth={true}
                                label="한줄평"
                                placeholder="한줄평 남기기"
                                // multiline
                                variant="filled"
                                value={this.state.comment}
                                onChange={handleChange}
                                onKeyDown={addComment}
                            />
                        </TableCell>
                        {/* </form> */}
                    </TableRow>
                </TableBody>
            );
        };

        return (
            <Table className={classes.table}>
                {isLoading ? (
                    <TableHead className="loader">
                        <TableRow className="loader__text">Loading..</TableRow>
                    </TableHead>
                ) : (
                    <>
                        <TableHead>
                            <TableRow>포스터를 클릭하시면 해당 영화에 대한 네이버 검색 결과로 리다이렉트 됩니다.</TableRow>
                        </TableHead>
                        {printMovieInfo(movies)}
                    </>
                )}
            </Table>
        );
    }
}

// ViewMovie.propTypes = {
//     id: PropTypes.string.isRequired,
//     year: PropTypes.string.isRequired,
//     title: PropTypes.string.isRequired,
//     poster: PropTypes.string.isRequired,
//     rating: PropTypes.string.isRequired,
//     director: PropTypes.string.isRequired,
//     actor: PropTypes.string.isRequired,
// };
export default withStyles(styles)(ViewMovie);
