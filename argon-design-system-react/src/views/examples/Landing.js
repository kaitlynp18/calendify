import React, { useState, useEffect, useRef } from "react";
import { useLocation } from 'react-router-dom';
import fullLogo from '../../assets/img/brand/full_logo.png';

// reactstrap components
import {
  FormGroup,
  Input,
  Container,
  Button,
} from "reactstrap";

const CalendarApp = (props) => {
  const location = useLocation();
  const calendarInput = location.state?.data;
  console.log(calendarInput);

  const [events, setEvents] = useState([]);

  useEffect(() => {
    if (calendarInput) {
      const parsedEvents = parseCalendarData(calendarInput);
      setEvents(parsedEvents);
    }
  }, [calendarInput]);

  const parseCalendarData = (calendarData) => {
    const events = [];
    const lines = calendarData.split('\n');
    let currentEvent = {};

    for (const line of lines) {
      if (line.startsWith('BEGIN:VEVENT')) {
        currentEvent = {};
      } else if (line.startsWith('SUMMARY:')) {
        currentEvent.summary = line.replace('SUMMARY:', '');
      } else if (line.startsWith('DTSTART;')) {
        currentEvent.startTime = parseDateTime(line.replace('DTSTART;', ''));
      } else if (line.startsWith('DTEND;')) {
        currentEvent.endTime = parseDateTime(line.replace('DTEND;', ''));
      } else if (line.startsWith('RRULE:')) {
        currentEvent.repeat = parseRepeat(line.replace('RRULE:', ''));
      } else if (line.startsWith('EXDATE;')) {
        currentEvent.excludeDates = parseExcludeDates(line.replace('EXDATE;', ''));
      } else if (line.startsWith('LOCATION:')) {
        currentEvent.location = line.replace('LOCATION:', '');
      } else if (line.startsWith('DESCRIPTION:')) {
        currentEvent.description = line.replace('DESCRIPTION:', '');
      } else if (line.startsWith('END:VEVENT')) {
        events.push(currentEvent);
      }
    }

    return events;
  };

  const parseDateTime = (dateTimeString) => {
    if (!dateTimeString) {
      return null;
    }

    let datePart;
    let timePart;

    if (dateTimeString.startsWith('TZID')) {
      // Case where the date and time start with "TZID"
      [, dateTimeString] = dateTimeString.split(':');
      [datePart, timePart] = dateTimeString.split('T');
    } else if (dateTimeString.startsWith('VALUE')) {
      // Case where it starts with "VALUE"
      [, datePart] = dateTimeString.split(':');
      timePart = null; // No time information in this case
    } else {
      // Default case
      if (dateTimeString.includes('T')) {
        [datePart, timePart] = dateTimeString.split('T');
      }
      else {
        [datePart,] = dateTimeString.split('T');
      }
    }

    if (!datePart) {
      return null;
    }

    // Extract year, month, day from datePart
    const [year, month, day] = [datePart.slice(0, 4), datePart.slice(4, 6), datePart.slice(6, 8)];

    // Extract hours, minutes from timePart
    const [hours, minutes] = (timePart || '').slice(0, 6).match(/.{1,2}/g) || [];

    if (!timePart) {
      return `${year}/${month}/${day}`;
    }

    return `${year}/${month}/${day} ${hours}:${minutes}`;
  };

  const parseRepeat = (rruleString) => {
    const repeatDetails = rruleString.split(';');
    const untilDate = parseDateTime(repeatDetails[1].split('=')[1]);
    const byDay = repeatDetails[2].split('=')[1];

    return `Weekly, ${byDay}, until ${untilDate}`;
  };

  const parseExcludeDates = (excludeDatesString) => {
    const excludeDates = excludeDatesString.split(',');
    return excludeDates.map(date => parseDateTime(date));
  };

  const mainRef = useRef(null);

  const [expandedEventIndex, setExpandedEventIndex] = useState(null);

  const handleToggleExpand = (index) => {
    // Toggle the expanded state for the clicked event
    setExpandedEventIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  const handleDeleteEvent = (index) => {
    // Remove the event at the specified index
    const updatedEvents = [...events];
    updatedEvents.splice(index, 1);
    setEvents(updatedEvents);
    // Close the expanded view if the deleted event was expanded
    if (expandedEventIndex === index) {
      setExpandedEventIndex(null);
    }
  };

  const generateCalendarData = () => {
    let calendarData = "BEGIN:VCALENDAR\nVERSION:2.0\nCALSCALE:GREGORIAN\n\n";

    for (const event of events) {
      calendarData += "BEGIN:VEVENT\n";
      calendarData += `SUMMARY:${event.summary}\n`;

      if (event.startTime.includes(':')) {
        calendarData += `DTSTART;TZID=America/New_York:${event.startTime.replace(/\/|-|:/g, '').replace(' ', 'T')}00\n`;
        calendarData += `DTEND;TZID=America/New_York:${event.endTime.replace(/\/|-|:/g, '').replace(' ', 'T')}00\n`;
      } else if (event.startTime) {
        calendarData += `DTSTART;VALUE=DATE:${event.startTime.replace(/\/|-/g, '')}\n`;
        calendarData += `DTEND;VALUE=DATE:${event.endTime.replace(/\/|-/g, '')}\n`;
      }

      if (event.repeat) {
        const repeatParts = event.repeat.split(', ');
        const untilDate = repeatParts[2].replace('until ', '');

        calendarData += `RRULE:FREQ=WEEKLY;UNTIL=${untilDate.replace(/\/|-|:/g, '').replace(' ', 'T')}59Z;BYDAY=${repeatParts[1]};WKST=SU\n`;
      }

      if (event.excludeDates && event.excludeDates.length > 0) {
        // Include excluded dates
        calendarData += `EXDATE;TZID=America/New_York:${event.excludeDates.map(date => date.replace(/\/|-|:/g, '').replace(' ', 'T') + '00').join(",")}\n`;
      }

      if (event.description) {
        // Include description
        calendarData += `DESCRIPTION:${event.description}\n`;
      }

      if (event.location) {
        calendarData += `LOCATION:${event.location}\n`;
      }

      calendarData += "END:VEVENT\n\n";
    }

    calendarData += "END:VCALENDAR";
    return calendarData;
  };

  const downloadCalendarFile = () => {
    const calendarData = generateCalendarData();
    const blob = new Blob([calendarData], { type: "text/plain" });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "calendar.ics";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <main ref={mainRef} style={{ overflowY: 'auto' }}>
        <section className="section section-hero section-shaped">

          <div style={{ position: 'absolute', top: 0, left: '4px', margin: '20px' }}>
            <img src={fullLogo} alt="Full Logo" style={{ height: '50px', width: 'auto' }} />
          </div>

          <div className="shape shape-style-1 shape-default">
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
          </div>
          <Container className="py-lg-md d-flex">
            <div style={{ color: 'white', width: '100%' }}>
              {/* Main Title with Padding Below */}
              <div style={{ textAlign: 'center', paddingTop: '75px' }}>
                <div style={{ fontSize: '30px', fontWeight: 'bold' }}>
                  Your Calendar Overview
                </div>
              </div>

              {/* Subtitle Description with Margin Below */}
              <div style={{ textAlign: 'center', marginBottom: '50px' }}>
                <div style={{ fontSize: '18px' }}>
                  Below are the events we've prepared for your calendar. Edit or remove any of them as you see fit.
                </div>
              </div>

              {events.map((event, index) => (
                <div>
                  <div
                    key={index}
                    style={{
                      backgroundColor: "rgba(255, 255, 255, 0.5)",
                      marginBottom: '20px',
                      border: '2px solid #5459BE',
                      padding: '10px',
                      borderRadius: '10px',
                      position: 'relative',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        cursor: 'pointer',
                      }}
                      onClick={() => handleToggleExpand(index)}
                    >

                      <label style={{ fontWeight: 'bold', color: 'white', fontSize: '18px', marginTop: '9px', marginBottom: '9px', marginRight: '10px' }}>{event.summary}</label>
                      <div style={{ marginLeft: 'auto' }}>
                        {expandedEventIndex === index ? (
                          <i className="fa fa-chevron-up" />
                        ) : (
                          <i className="fa fa-chevron-down" />
                        )}
                      </div>
                    </div>

                    {expandedEventIndex === index && (
                      <div>
                        <FormGroup style={{ marginTop: '10px', marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
                          <label style={{ width: '100px', color: 'white', marginRight: '10px' }}>Time:</label>
                          <Input type="text" value={`${event.startTime} - ${event.endTime}`} onChange={(e) => { const updatedEvents = [...events]; updatedEvents[index].startTime = e.target.value; setEvents(updatedEvents); }} />
                        </FormGroup>

                        <FormGroup style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
                          <label style={{ width: '100px', color: 'white', marginRight: '10px' }}>Recurrence:</label>
                          <Input type="text" value={event.repeat || 'n/a'} onChange={(e) => { const updatedEvents = [...events]; updatedEvents[index].repeat = e.target.value; setEvents(updatedEvents); }} />
                        </FormGroup>

                        <FormGroup style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
                          <label style={{ width: '100px', color: 'white', marginRight: '10px' }}>Location:</label>
                          <Input type="text" value={event.location || 'n/a'} onChange={(e) => { const updatedEvents = [...events]; updatedEvents[index].location = e.target.value; setEvents(updatedEvents); }} />
                        </FormGroup>

                        <FormGroup style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
                          <label style={{ width: '100px', color: 'white', marginRight: '10px' }}>Description:</label>
                          <Input type="text" value={event.description || 'n/a'} onChange={(e) => { const updatedEvents = [...events]; updatedEvents[index].description = e.target.value; setEvents(updatedEvents); }} />
                        </FormGroup>
                      </div>
                    )}
                    <Button
                      color="link"
                      style={{
                        position: 'absolute',
                        top: '5px',
                        right: '-50px',
                        color: 'white',
                      }}
                      onClick={() => handleDeleteEvent(index)}
                    >
                      <i className="fa fa-trash" aria-hidden="true"></i>
                    </Button>
                  </div>

                </div>
              ))}

            </div>

          </Container>
          <div style={{ textAlign: 'center' }}>
            <Button
              className="btn-white btn-icon mb-5"
              color="default"
              size="m"
              onClick={downloadCalendarFile}
            >
              <span className="btn-inner--icon mr-1" style={{ marginTop: "8px" }}>
                <i className="fa fa-check-square-o" />
              </span>
              <span className="btn-inner--text">Confirm</span>
            </Button>
          </div>
        </section>
      </main>
    </>
  );
};

export default CalendarApp;