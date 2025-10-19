import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import "./Dealers.css";
import "../assets/style.css";
import positive_icon from "../assets/positive.png";
import neutral_icon from "../assets/neutral.png";
import negative_icon from "../assets/negative.png";
import review_icon from "../assets/reviewbutton.png";
import Header from '../Header/Header';

const Dealer = () => {
  const [dealer, setDealer] = useState(null); // start with null
  const [reviews, setReviews] = useState([]);
  const [unreviewed, setUnreviewed] = useState(false);
  const [postReview, setPostReview] = useState(null);

  const params = useParams();
  const id = params.id;

  const root_url = window.location.origin + '/';
  const dealer_url = `${root_url}djangoapp/dealer/${id}`;
  const reviews_url = `${root_url}djangoapp/reviews/dealer/${id}`;
  const post_review_url = `${root_url}postreview/${id}`;

  const getDealer = async () => {
    try {
      const res = await fetch(dealer_url);
      const retobj = await res.json();
      if (retobj.status === 200) {
        setDealer(Array.isArray(retobj.dealer) ? retobj.dealer[0] : retobj.dealer);
      }
    } catch (err) {
      console.error("Failed to fetch dealer:", err);
    }
  };

  const getReviews = async () => {
    try {
      const res = await fetch(reviews_url);
      const retobj = await res.json();
      if (retobj.status === 200) {
        if (retobj.reviews && retobj.reviews.length > 0) {
          setReviews(retobj.reviews);
        } else {
          setUnreviewed(true);
        }
      }
    } catch (err) {
      console.error("Failed to fetch reviews:", err);
      setUnreviewed(true);
    }
  };

  const senti_icon = (sentiment) => {
    if (sentiment === "positive") return positive_icon;
    if (sentiment === "negative") return negative_icon;
    return neutral_icon;
  };

  useEffect(() => {
    getDealer();
    getReviews();
    if (sessionStorage.getItem("username")) {
      setPostReview(
        <a href={post_review_url}>
          <img
            src={review_icon}
            style={{ width: '10%', marginLeft: '10px', marginTop: '10px' }}
            alt="Post Review"
          />
        </a>
      );
    }
  }, []);

  if (!dealer) return <div><Header />Loading dealer info...</div>;

  return (
    <div style={{ margin: "20px" }}>
      <Header />
      <div style={{ marginTop: "10px" }}>
        <h1 style={{ color: "grey" }}>
          {dealer.full_name || "No Name"} {postReview}
        </h1>
        <h4 style={{ color: "grey" }}>
          {dealer.city || ""}, {dealer.address || ""}, Zip - {dealer.zip || ""}, {dealer.state || ""}
        </h4>
      </div>

      <div className="reviews_panel">
        {reviews.length === 0 && !unreviewed && <div>Loading Reviews....</div>}
        {unreviewed && <div>No reviews yet!</div>}
        {reviews.map((review, idx) => (
          <div className="review_panel" key={idx}>
            <img src={senti_icon(review.sentiment)} className="emotion_icon" alt="Sentiment" />
            <div className="review">{review.review}</div>
            <div className="reviewer">
              {review.name} {review.car_make} {review.car_model} {review.car_year}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dealer;
