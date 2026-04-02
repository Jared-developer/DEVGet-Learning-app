import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const CourseInstructors = ({ courseId }) => {
    const [instructors, setInstructors] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (courseId) {
            fetchInstructors();
        }
    }, [courseId]);

    const fetchInstructors = async () => {
        try {
            const token = (await supabase.auth.getSession()).data.session?.access_token;
            const response = await fetch(`/api/instructors/course/${courseId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                const data = await response.json();
                setInstructors(data);
            }
        } catch (error) {
            console.error('Error fetching instructors:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return null;
    }

    if (instructors.length === 0) {
        return null;
    }

    return (
        <div className="course-instructors">
            <h3>👨‍🏫 Course Instructors</h3>
            <div className="instructors-list">
                {instructors.map(instructor => (
                    <div key={instructor.id} className="instructor-card">
                        <div className="instructor-avatar">
                            {instructor.user?.raw_user_meta_data?.fullName?.[0]?.toUpperCase() ||
                                instructor.user?.email?.[0]?.toUpperCase() || '?'}
                        </div>
                        <div className="instructor-info">
                            <h4>{instructor.user?.raw_user_meta_data?.fullName || 'Instructor'}</h4>
                            <p>{instructor.user?.email}</p>
                        </div>
                    </div>
                ))}
            </div>

            <style jsx>{`
        .course-instructors {
          margin: 30px 0;
          padding: 20px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 12px;
          color: white;
        }

        .course-instructors h3 {
          margin: 0 0 20px 0;
          font-size: 20px;
          font-weight: 600;
        }

        .instructors-list {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 15px;
        }

        .instructor-card {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 15px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          backdrop-filter: blur(10px);
          transition: transform 0.3s, background 0.3s;
        }

        .instructor-card:hover {
          transform: translateY(-2px);
          background: rgba(255, 255, 255, 0.15);
        }

        .instructor-avatar {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          font-weight: 600;
          flex-shrink: 0;
        }

        .instructor-info {
          flex: 1;
          min-width: 0;
        }

        .instructor-info h4 {
          margin: 0 0 5px 0;
          font-size: 16px;
          font-weight: 600;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .instructor-info p {
          margin: 0;
          font-size: 13px;
          opacity: 0.9;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        @media (max-width: 768px) {
          .course-instructors {
            padding: 15px;
          }

          .instructors-list {
            grid-template-columns: 1fr;
          }

          .instructor-avatar {
            width: 40px;
            height: 40px;
            font-size: 20px;
          }

          .instructor-info h4 {
            font-size: 14px;
          }

          .instructor-info p {
            font-size: 12px;
          }
        }
      `}</style>
        </div>
    );
};

export default CourseInstructors;
