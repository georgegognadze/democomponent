import React, { useState } from "react";
import "./DataList.css";
// I worked on the functional side more than styling part as far as I could remember the functionals
const jsonData = [
  {
    no_event: "10017071",
    event_name: "NORTHERN IRELAND PREMIERSHIP",
    match_date: "202502202300",
    club_home: "Cliftonville",
    club_away: "Carrick Rangers",
    handicap_display: "1|",
    odds_home: "0.8700|1.8200",
    odds_away: "0.8900|1.8400",
    price_alert_flag_home: "0",
    price_alert_flag_away: "1",
  },
  {
    no_event: "",
    event_name: "",
    match_date: "202502212300",
    club_home: "Dungannon Swifts",
    club_away: "Linfield FC",
    handicap_display: "|1",
    odds_home: "0.8400|1.7900",
    odds_away: "0.9200|1.8700",
    price_alert_flag_home: "-1",
    price_alert_flag_away: "1",
  },
  {
    no_event: "",
    event_name: "",
    match_date: "202502212300",
    club_home: "Glenavon FC",
    club_away: "Crusaders FC",
    handicap_display: "|0-0.5",
    odds_home: "0.9000|1.8500",
    odds_away: "0.8600|1.8100",
  },
  {
    no_event: "",
    event_name: "",
    match_date: "202502212300",
    club_home: "Glentoran FC",
    club_away: "Ballymena United",
    handicap_display: "1|",
    odds_home: "0.9800|1.9300",
    odds_away: "0.7800|1.7300",
  },
  {
    no_event: "",
    event_name: "",
    match_date: "202502212300",
    club_home: "Loughgall",
    club_away: "Larne",
    handicap_display: "|1",
    odds_home: "0.9800|1.9300",
    odds_away: "0.7800|1.7300",
  },
  {
    no_event: "",
    event_name: "",
    match_date: "202502210100",
    club_home: "Coleraine",
    club_away: "Portadown FC",
    handicap_display: "0.5-1|",
    odds_home: "0.9500|1.9000",
    odds_away: "0.8100|1.7600",
  },
  {
    no_event: "10016888",
    event_name: "CHILE PRIMERA DIVISION",
    match_date: "202503160000",
    club_home: "Curico Unido",
    club_away: "Palestino",
    handicap_display: "0|",
    odds_home: "0.7500|1.5500",
    odds_away: "1.1700|1.9500",
  },
  {
    no_event: "",
    event_name: "",
    match_date: "",
    club_home: "",
    club_away: "",
    handicap_display: "0-0.5|",
    odds_home: "1.0900|1.8900",
    odds_away: "0.8100|1.6100",
  },
];
const preprocessData = (data) => {
  let lastEvent = "";
  let lastEventName = "";

  return data.map((match) => {
    if (match.no_event) {
      lastEvent = match.no_event;
    } else {
      match.no_event = lastEvent;
    }

    if (match.event_name) {
      lastEventName = match.event_name;
    } else {
      match.event_name = lastEventName;
    }

    return match;
  });
};

const jsonDataLoad = preprocessData([...jsonData]);

const formatDate = (dateString) => {
  if (!dateString) return "";
  const minute = dateString.substring(10, 12);
  let hour = parseInt(dateString.substring(8, 10), 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  const day = dateString.substring(6, 8);
  const month = dateString.substring(4, 6);

  hour = hour % 12 || 12;

  return (
    <>
      {month}/{day} <br /> {hour}:{minute} <br />
      <span style={{ color: "#373354" }}>{ampm}</span>
    </>
  );
};
const parseHandicap = (handicap) => {
  if (!handicap) return "";
  return handicap.replace('|', '');
};

const Match = ({ match }) => {
  const formatOdds = (odds) => {
    return parseFloat(odds).toFixed(2);
  };

  return (
    <div className="match">
      <div className="match-time">{formatDate(match.match_date)}</div>
      <div className="teams">
        <span>{match.club_home}</span>
        <br />
        <span>{match.club_away}</span>
      </div>
      <div className="odds">
      {match.handicap_display && (
          <span className="handicap">
            <span> {parseHandicap(match.handicap_display)}</span>
          </span>
        )}
        <span>{formatOdds(match.odds_home.split("|")[0])}</span>
        <br />
        <span className="match-odds-away">
          {formatOdds(match.odds_away.split("|")[0])}
        </span>
      </div>
    </div>
  );
};

const MatchList = () => {
  const eventNames = [
    ...new Set(
      jsonDataLoad.map((match) => match.event_name).filter(Boolean)
    ),
  ];

  const [openEvents, setOpenEvents] = useState(
    eventNames.reduce((acc, name) => ({ ...acc, [name]: true }), {})
  );

  const toggleEvent = (eventName) => {
    setOpenEvents((prev) => ({
      ...prev,
      [eventName]: !prev[eventName],
    }));
  };

  let currentEvent = "";
  let gameCount = 0;

  return (
    <div className="container">
      {jsonDataLoad.map((match, index) => {
        let showEventHeader =
          match.event_name && match.event_name !== currentEvent;
        if (showEventHeader) {
          currentEvent = match.event_name;
          gameCount = jsonDataLoad.filter(
            (m) => m.event_name === currentEvent
          ).length;
        }

        return (
          <div key={index}>
            {showEventHeader && (
              <div
                className="event-section"
                onClick={() => toggleEvent(match.event_name)}
              >
                <span className="arrow">
                  {openEvents[match.event_name] ? "↑" : "↓"}
                </span>
                <span>{match.event_name}</span>
                <span className="game-count">({gameCount})</span>
              </div>
            )}

            {openEvents[match.event_name] && <Match match={match} />}
          </div>
        );
      })}
    </div>
  );
};

export default MatchList;
