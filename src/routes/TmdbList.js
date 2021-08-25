import React from 'react';
import axios from 'axios';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';
import { index } from 'cheerio/lib/api/traversing';
import { Link } from 'react-router-dom';
import ReactPlayer from 'react-player';
import '../css/Dialog.css';

/**
 * 박스오피스 / 개봉 예정작 버튼에 각각 ID값을 줘
 * 이를 처리하는 onOpenChange에서 id값에 따라 state값을 바꾸도록 설정. (line 71 참조)
 *
 *  Dialog를 중복해서 출력하는게 아니라
 * viewChange 여부에 따라 화면에 렌더링할 배열을 그에 맞게 설정하고 (line 152 부근 참조)
 * 그 후에 Dialog를 출력하는 함수를 하나만 if문 밖에 배치해서 코드 최적화 했음.
 * 출연진 : 기존 5명 출력에서 6명으로 늘리고 텍스트를 "주요 출연진"으로 바꿨음.
 *
 * 캐스팅 목록 그리드형 배치 위해 9번 줄에 Dialog 전담 css 파일 생성 후 적용.
 */
class TmdbList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            tmdbs: [],
            titles: '',
            movies: '',
            open: false,
            castMember: [],
            upcommings: [],
            viewChange: false,
            trailers: [],
            similer: [],
        };
        this.onOpenChange = this.onOpenChange.bind(this);
        this.onCloseHandle = this.onCloseHandle.bind(this);
        this.onClickHandles = this.onClickHandles.bind(this);
    }

    getTrendingMovies = async () => {
        // Tmdb API 이용
        const TMDB_API_KEY = process.env.REACT_APP_TMDB_API_KEY;
        const {
            data: { results },
        } = await axios.get(`
        https://api.themoviedb.org/3/trending/movie/day?api_key=${TMDB_API_KEY}&language=ko`);
        console.log('trending_Movies', results);
        this.setState({ tmdbs: results, isLoading: false });
    };

    getUpcommingMovies = async () => {
        const TMDB_API_KEY = process.env.REACT_APP_TMDB_API_KEY;
        const {
            data: { results },
        } = await axios.get(
            `https://api.themoviedb.org/3/movie/upcoming?api_key=${TMDB_API_KEY}&language=ko&page=1&region=kr`
        );
        console.log('upcomming_movies', results);
        this.setState({ upcommings: results, isLoading: false });
    };

    getMovieCasts = async (id) => {
        const TMDB_API_KEY = process.env.REACT_APP_TMDB_API_KEY;
        const {
            data: { cast },
        } = await axios.get(
            `https://api.themoviedb.org/3/movie/${id}/credits?api_key=${TMDB_API_KEY}`
        );
        console.log('cast', cast);
        this.setState({ castMember: cast.slice(0, 5), isLoading: false }); // 출연진 5명만 추출(slice())
    };

    getMovieVideos = async (id) => {
        const TMDB_API_KEY = process.env.REACT_APP_TMDB_API_KEY;
        const {
            data: { results },
        } = await axios.get(`
        https://api.themoviedb.org/3/movie/${id}/videos?api_key=${TMDB_API_KEY}&language=en-US`);
        console.log('videos', results);
        this.setState({ trailers: results.slice(0, 1) });
        console.log('videos_slice', this.state.trailers);
    };

    getSimilerMovies = async (id) => {
        const TMDB_API_KEY = process.env.REACT_APP_TMDB_API_KEY;
        const {
            data: { results },
        } = await axios.get(
            `https://api.themoviedb.org/3/movie/${id}/similar?api_key=${TMDB_API_KEY}&language=ko&page=1`
        );
        this.setState({ similer: results.slice(0, 4) });
    };

    // 영화 포스터를 클릭하면 다이얼로그를 띄우도록 하는 함수
    onOpenChange = (e) => {
        // Click발생한 영화포스터의 제목, 영화정보(,로 split), 다이얼로그 상태변경
        this.setState({
            open: !this.state.open,
            titles: e.target.title,
            movies: e.target.id.split(','),
        });
        console.log('titles', this.state.titles);
        console.log('target값', e.target.id.substring(0, 7));
        console.log('movies_posterClick', this.state.movies); // 클릭된 포스터의 영화정보 가져옴
        this.getMovieCasts(e.target.id.substring(0, 7)); // 현재 state에서 가져오지 않고 바로 target에 잡힌 날것의 데이터 삽입
        this.getMovieVideos(e.target.id.substring(0, 7));
        this.getSimilerMovies(e.target.id.substring(0, 7));
    };

    onCloseHandle = () => {
        this.setState({ open: false });
    };

    onClickHandles = (event) => {
        let id = event.target.id;
        id === 'btnBoxOffice'
            ? this.setState({ viewChange: false })
            : this.setState({ viewChange: true });
        console.log('viewChange', this.state.viewChange);
        console.log('event:', event.target.id);
    };

    componentDidMount() {
        this.getTrendingMovies();
        this.getUpcommingMovies();
    }

    printDialog = (castMember, movies, url, trailer, trailers, similer) => {
        return (
            <Dialog open={this.state.open} onClose={this.onCloseHandle} maxWidth="md">
                <DialogTitle>{this.state.titles}</DialogTitle>
                <DialogContent>
                    <Table>
                        <TableRow>
                            <TableCell align="center" rowSpan="4" width="25%">
                                <img src={url + movies[3]} alt="Poster" />
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>
                                <b>{movies[4]}</b>
                            </TableCell>
                            <TableCell>
                                {' '}
                                {movies[2]} <b>[★{movies[1]}]</b>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>
                                <b>줄거리:</b>
                            </TableCell>
                            <TableCell>
                                <label>{movies.slice(5)}</label>
                            </TableCell>
                        </TableRow>
                    </Table>
                    <Table>
                        <TableRow>
                            <div className="container">
                                {castMember.map((c) => (
                                    <TableCell>
                                        <>
                                            <Link to={'/Filmography/' + c.id}>
                                                <img
                                                    className="item"
                                                    src={
                                                        c.profile_path
                                                            ? url + c.profile_path
                                                            : 'https://image.tmdb.org/t/p/w200/rAgsOIhqRS6tUthmHoqnqh9PIAE.jpg'
                                                    }
                                                    alt="castingMembers"
                                                    width="100"
                                                    height="100"
                                                />
                                            </Link>{' '}
                                            <br />
                                            <span>
                                                <b>{c.name}</b>
                                            </span>
                                            <br />[{c.character}]
                                        </>
                                    </TableCell>
                                ))}
                            </div>
                        </TableRow>
                        <TableRow>
                            {trailers.map((t) => (
                                <TableCell>
                                    {' '}
                                    {/*현재 어플리케이션을 돌리는 주소를 매핑 해야함(localhost) */}
                                    <ReactPlayer
                                        url={trailer + t.key + '&origin=https://localhost:3000'}
                                        controls
                                    ></ReactPlayer>
                                </TableCell>
                            ))}
                        </TableRow>
                    </Table>
                    <Table>
                        <TableRow>
                            <TableHead>
                                <b>이런영화는 어떤가요?</b>
                            </TableHead>
                            <TableBody>
                                {similer.map((s) => (
                                    <TableCell>
                                        <Link to={'/viewTmdb/' + s.id} >
                                        <img src={url + s.poster_path} />
                                        </Link>
                                    </TableCell>
                                ))}
                            </TableBody>
                        </TableRow>
                    </Table>
                </DialogContent>
            </Dialog>
        );
    };

    render() {
        const { tmdbs, movies, castMember, upcommings, viewChange, trailers, similer } = this.state;
        const url = 'https://image.tmdb.org/t/p/w200';
        const trailer = 'https://www.youtube.com/embed/';
        return (
            <>
                <button id="btnBoxOffice" onClick={this.onClickHandles}>
                    BoxOffice
                </button>
                <button id="btnUpcomingRelease" onClick={this.onClickHandles}>
                    개봉예정작
                </button>
                <br />
                {viewChange
                    ? upcommings.map((u) => (
                          <img
                              className="poster"
                              src={url + u.poster_path}
                              alt="img"
                              onClick={this.onOpenChange}
                              id={[
                                  u.id,
                                  u.vote_average,
                                  u.release_date,
                                  u.poster_path,
                                  u.original_title,
                                  u.overview,
                              ]}
                              title={u.title}
                          />
                      ))
                    : tmdbs.map((m, index) => (
                          <>
                              <img
                                  className="poster"
                                  src={url + m.poster_path}
                                  alt="img"
                                  onClick={this.onOpenChange}
                                  id={[
                                      m.id,
                                      m.vote_average,
                                      m.release_date,
                                      m.poster_path,
                                      m.original_title,
                                      m.overview,
                                  ]}
                                  title={m.title}
                              />
                          </>
                      ))}
                {this.printDialog(castMember, movies, url, trailer, trailers, similer)}
            </>
        );
    }
}
export default TmdbList;
