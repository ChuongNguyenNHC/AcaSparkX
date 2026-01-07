import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Plyr from 'plyr';
import 'plyr/dist/plyr.css';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { courseAPI, lessonAPI } from '../api/api';
import './CourseLearning.css';

const CourseLearning = () => {
    const { courseId, lessonId } = useParams();
    const navigate = useNavigate();

    const [course, setCourse] = useState(null);
    const [lessons, setLessons] = useState([]);
    const [currentLesson, setCurrentLesson] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userRating, setUserRating] = useState(0);
    const [lessonRatingLoading, setLessonRatingLoading] = useState(false);
    const [tempRating, setTempRating] = useState(0);

    const videoRef = useRef(null);
    const playerRef = useRef(null);
    const isInitialLoad = useRef(true);
    const isFetchingData = useRef(false);

    const handleRating = async (stars) => {
        if (lessonRatingLoading || !currentLesson) return;

        try {
            setLessonRatingLoading(true);
            setTempRating(stars);

            const rateResponse = await lessonAPI.rate(currentLesson.id, stars);
            const { avg_rating, user_rating } = rateResponse.data.data;

            setUserRating(user_rating);

            setLessons(prev => prev.map(l =>
                l.id === currentLesson.id
                    ? { ...l, avg_rating, user_rating }
                    : l
            ));

            setCurrentLesson(prev => ({
                ...prev,
                avg_rating,
                user_rating
            }));

        } catch (err) {
            console.error("Error rating lesson:", err);
            alert("Không thể gửi đánh giá. Vui lòng thử lại sau.");
        } finally {
            setLessonRatingLoading(false);
            setTempRating(0);
        }
    };

    useEffect(() => {
        if (lessonId && lessons.length > 0) {
            const lesson = lessons.find(l => l.id === lessonId);
            if (lesson && lesson.id !== currentLesson?.id) {
                setCurrentLesson(lesson);
            }
        }
    }, [lessonId, lessons]);

    useEffect(() => {
        if (currentLesson) {
            setUserRating(currentLesson.user_rating || 0);
        }
    }, [currentLesson?.id]);

    useEffect(() => {
        const fetchCourseData = async () => {
            if (isFetchingData.current) return;
            try {
                isFetchingData.current = true;
                setLoading(true);
                const response = await courseAPI.getDetails(courseId);
                const { course, lessons } = response.data.data;

                const transformedLessons = lessons.map(lesson => ({
                    ...lesson,
                    sources: [
                        { src: lesson.video_url, type: 'video/mp4', size: 720 }
                    ]
                }));

                setCourse(course);
                setLessons(transformedLessons);

                if (transformedLessons.length > 0) {
                    const targetLesson = lessonId
                        ? transformedLessons.find(l => l.id === lessonId) || transformedLessons[0]
                        : transformedLessons[0];

                    setCurrentLesson(targetLesson);
                    setUserRating(targetLesson.user_rating || 0);

                    if (!lessonId) {
                        navigate(`/course/${courseId}/learn/${targetLesson.id}`, { replace: true });
                    }
                }
                setError(null);
            } catch (err) {
                console.error("Error fetching course data:", err);
                setError("Không thể tải nội dung khóa học. Vui lòng thử lại sau.");
            } finally {
                setLoading(false);
                isFetchingData.current = false;
            }
        };

        if (courseId) {
            fetchCourseData();
        }
    }, [courseId]);

    useEffect(() => {
        if (loading || !videoRef.current || playerRef.current) return;

        let player;
        const initTimer = setTimeout(() => {
            if (playerRef.current) return;

            player = new Plyr(videoRef.current, {
                ratio: '16:9',
                quality: {
                    default: 720,
                    options: [1080, 720],
                    forced: true,
                },
                speed: {
                    selected: 1,
                    options: [0.5, 0.75, 1, 1.25, 1.5, 2]
                },
                controls: [
                    'play-large', 'play', 'progress', 'current-time', 'mute', 'volume', 'captions', 'settings', 'pip', 'airplay', 'fullscreen'
                ],
                autoplay: false,
            });


            playerRef.current = player;

            // Trigger internal source check now that player is ready
            setPlayerReady(prev => prev + 1);
        }, 50);

        return () => {
            clearTimeout(initTimer);
            if (player) {
                player.destroy();
                playerRef.current = null;
            }
        };
    }, [loading]);

    const [playerReady, setPlayerReady] = useState(0);

    useEffect(() => {
        if (playerRef.current && currentLesson) {
            playerRef.current.source = {
                type: 'video',
                title: currentLesson.title,
                sources: currentLesson.sources,
                poster: currentLesson.thumbnail || course?.thumbnail,
            };

            if (isInitialLoad.current) {
                isInitialLoad.current = false;
            }
        }
    }, [currentLesson?.id, playerReady]);

    if (loading) {
        return (
            <div className="course-learning-page loading">
                <Header />
                <div className="loading-container">
                    <div className="spinner"></div>
                    <p>Đang tải nội dung bài học...</p>
                </div>
                <Footer />
            </div>
        );
    }

    if (error || !currentLesson) {
        return (
            <div className="course-learning-page error">
                <Header />
                <div className="error-state">
                    <h2>Oops!</h2>
                    <p>{error || "Không tìm thấy nội dung bài học."}</p>
                    <button className="back-btn" onClick={() => navigate('/courses')}>Quay lại danh sách khóa học</button>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="course-learning-page">
            <Header />
            <div className="learning-container">
                <div className="main-content">
                    <div className="video-player-wrapper">
                        <div className="plyr-wrapper">
                            <video
                                ref={videoRef}
                                className="plyr"
                                playsInline
                                poster={currentLesson.thumbnail}
                            />
                        </div>
                    </div>

                    <div className="video-info">
                        <div className="title-area">
                            <h1>{currentLesson.title}</h1>
                            <div className="avg-rating-badge">
                                <span>{currentLesson.avg_rating}</span>
                                <span className="star-icon">★</span>
                                <span className="rating-text">(Đánh giá trung bình)</span>
                            </div>
                        </div>
                        <div className="video-actions">
                            <div className="rating-container">
                                <span className="rating-label">Đánh giá bài học:</span>
                                <div className="star-rating">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            className={`star-btn ${star <= (lessonRatingLoading ? tempRating : userRating) ? 'active' : ''}`}
                                            onClick={() => handleRating(star)}
                                            title={`${star} sao`}
                                            disabled={lessonRatingLoading}
                                        >
                                            ★
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="video-description">
                            <h3>Mô tả bài học</h3>
                            <div dangerouslySetInnerHTML={{ __html: currentLesson.description }} />
                            <br />
                            <p>Khóa học: {course?.title}</p>
                        </div>
                    </div>
                </div>

                <div className="playlist-sidebar">
                    <div className="playlist-header">
                        <h2>Nội dung khóa học</h2>
                        <span className="playlist-info">
                            {lessons.findIndex(l => l.id === currentLesson.id) + 1} / {lessons.length} bài học
                        </span>
                    </div>

                    <div className="playlist-items">
                        {lessons.map((lesson, index) => (
                            <div
                                key={lesson.id}
                                className={`playlist-item ${currentLesson.id === lesson.id ? 'active' : ''}`}
                                onClick={() => navigate(`/course/${courseId}/learn/${lesson.id}`)}
                            >
                                <div className="item-thumbnail">
                                    <img src={lesson.thumbnail || course?.thumbnail} alt={lesson.title} />
                                </div>
                                <div className="item-info">
                                    <div className="item-title">{index + 1}. {lesson.title}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default CourseLearning;
