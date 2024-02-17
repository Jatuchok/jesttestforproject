import request from 'supertest';

const serverURL = 'http://47.128.221.203:5000';

describe('Users', () => {
    let authToken = '';

    beforeAll(async () => {
        try {
            const loginResponse = await request(serverURL)
                .post('/auth/login')
                .send({ pin: '1', citizen_id: '1' });

            if (loginResponse.status === 200) {
                authToken = loginResponse.body.token;
            } else {
                throw new Error('Login failed');
            }
        } catch (error) {
            console.error('Error during login:', error);
            throw new Error('Login failed');
        }
    });

    describe('List Users', () => {
        it('gets user', async () => {
            try {
                const response = await request(serverURL)
                    .get('/admin/user/getalluser')
                    .set('Authorization', `Bearer ${authToken}`)
                    .expect(200);

                expect(response.body).toBeDefined();
                // Add further assertions based on the response data
            } catch (error) {
                console.error('Error while listing users:', error);
                throw new Error('Failed to list users');
            }
        });

        it('gets user by id', async () => {
            try {
                const response = await request(serverURL)
                    .get('/admin/user/getuser/5')
                    .set('Authorization', `Bearer ${authToken}`)
                    .expect(200);

                expect(response.body).toBeDefined();
                // Add further assertions based on the response data
            } catch (error) {
                console.error('Error while listing users:', error);
                throw new Error('Failed to list users');
            }
        });
    });

    describe('Add user', () => {
        it('adds a new user with valid format', async () => {
            const response = await request(serverURL)
                .post('/admin/user/add')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    pin: '123456789012-0',
                    citizen_id: '1234567890123', // valid format
                    firstname: 'John',
                    lastname: 'Doe',
                    account_type: 'user',
                })
                .expect(201);

            expect(response.body).toBeDefined();
            expect(response.body.user_id).toBeDefined();
        });

        it('adds a new user with invalid format', async () => {
            const response = await request(serverURL)
                .post('/admin/user/add')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    pin: '123456789012-09999',
                    citizen_id: '1234567890123321', // invalid format
                    firstname: 'John!!',
                    lastname: 'Doe!!',
                    account_type: 'god',
                })
                .expect(400);

            expect(response.body).toBeDefined();
            expect(response.body.user_id).toBeUndefined();
        });
    });

    describe('Search User', () => {
        beforeAll(async () => {
            try {
                const loginResponse = await request(serverURL)
                    .post('/auth/login')
                    .send({ pin: '1', citizen_id: '1' });

                if (loginResponse.status === 200) {
                    authToken = loginResponse.body.token;
                } else {
                    throw new Error('Login failed');
                }
            } catch (error) {
                console.error('Error during login:', error);
                throw new Error('Login failed');
            }
        });

        it('searches for users with valid search term', async () => {
            const response = await request(serverURL)
                .post('/admin/user/search')
                .set('Authorization', `Bearer ${authToken}`)
                .send({ search: 'admin' })
                .expect(200);

            expect(response.body).toBeDefined();
        });
    });

    describe('Update User', () => {
        it('updates user information with valid inputs', async () => {
            try {
                const response = await request(serverURL)
                    .patch('/admin/user/updateuser/97') // Put number to edit
                    .set('Authorization', `Bearer ${authToken}`)
                    .send({
                        firstname: 'NewFirstName',
                        lastname: 'NewLastName',
                        citizen_id: '1234567890124',
                        pin: '123456789012-1',
                    })
                    .expect(200);

                expect(response.body).toBeDefined();
                // Add further assertions based on the response data
            } catch (error) {
                console.error('Error while updating user information:', error);
                throw new Error('Failed to update user information');
            }
        });
    });
    
    describe('Deactivate User', () => {
        it('deactivates user account successfully', async () => {
            try {
                const response = await request(serverURL)
                    .delete('/admin/user/deactivateUser/105') // Put the user ID to deactivate
                    .set('Authorization', `Bearer ${authToken}`)
                    .expect(200);
    
                expect(response.body).toBeDefined();
                // Add further assertions based on the response data
            } catch (error) {
                console.error('Error while deactivating user account:', error);
                throw new Error('Failed to deactivate user account');
            }
        });
    });
    
    describe('List Rooms', () => {
        it('gets rooms', async () => {
            try {
                const response = await request(serverURL)
                    .get('/admin/room/getallroom')
                    .set('Authorization', `Bearer ${authToken}`)
                    .expect(200);

                expect(response.body).toBeDefined();
                // Add further assertions based on the response data
            } catch (error) {
                console.error('Error while listing rooms:', error);
                throw new Error('Failed to list rooms');
            }
        });

        it('gets room by id', async () => {
            try {
                const roomId = '5'; // Change to the desired room ID
                const response = await request(serverURL)
                    .get(`/admin/room/getroom/${roomId}`)
                    .set('Authorization', `Bearer ${authToken}`)
                    .expect(200);

                expect(response.body).toBeDefined();
                // Add further assertions based on the response data
            } catch (error) {
                console.error('Error while getting room by id:', error);
                throw new Error('Failed to get room by id');
            }
        });
    });

    describe('Add room', () => {
        it('adds a new room with valid format', async () => {
            const response = await request(serverURL)
                .post('/admin/room/add')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    room_number: '9999',
                    room_level: 9,
                    room_capacity: 30,
                    room_type: 'ห้องปฏิบัติการ',
                    facilities_id: [1]
                })
                .expect(201);

            expect(response.body).toBeDefined();
            expect(response.body.user_id).toBeDefined();
        });

        it('adds a new user with invalid format', async () => {
            const response = await request(serverURL)
                .post('/admin/room/add')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    room_number: 'เก้าเก้าเก้าเก้า',
                    room_level: 'เก้า',
                    room_capacity: 'สามสิบ',
                    room_type: 'ห้องปฏิบัติการ',
                    facilities_id: ['หนึ่ง']
                })
                .expect(400);

            expect(response.body).toBeDefined();
            expect(response.body.user_id).toBeUndefined();
        });
    });

    describe('Update Room', () => {
        it('updates Room information with valid inputs', async () => {
            try {
                const response = await request(serverURL)
                    .patch('/admin/room/updateroom/33')
                    .set('Authorization', `Bearer ${authToken}`)
                    .send({
                        room_number: '9997',
                        room_level: 9,
                        room_capacity: 30,
                        room_type: 'ห้องปฏิบัติการ',
                        room_status: '1', // Add room_status
                        facilities_id: [1]
                    })
                    .expect(200);
    
                expect(response.body).toBeDefined();
                // Add further assertions based on the response data
            } catch (error) {
                console.error('Error while updating Room information:', error);
                throw new Error('Failed to update Room information');
            }
        });
    });    

    describe('Delete Room', () => {
        it('deletes Room successfully', async () => {
            try {
                const response = await request(serverURL)
                    .delete('/admin/room/deleteroom/32') // Put the room_id to delete
                    .set('Authorization', `Bearer ${authToken}`)
                    .expect(200);
    
                expect(response.body).toBeDefined();
                // Add further assertions based on the response data
            } catch (error) {
                console.error('Error while deleting Room:', error);
                throw new Error('Failed to delete Room');
            }
        });
    });
    
    
    describe('List all report', () => {
        it('gets all report', async () => {
            try {
                const response = await request(serverURL)
                    .get('/admin/getreport')
                    .set('Authorization', `Bearer ${authToken}`)
                    .expect(200);

                expect(response.body).toBeDefined();
                // Add further assertions based on the response data
            } catch (error) {
                console.error('Error while listing users:', error);
                throw new Error('Failed to list users');
            }
        });
    });

    describe('Update Report Status', () => {
        it('updates report status with valid input', async () => {
            try {
                const response = await request(serverURL)
                    .patch('/admin/updatereportstatus/29') // Replace 'Number behide / ' with valid report ID
                    .set('Authorization', `Bearer ${authToken}`)
                    .send({ report_status: '0' }) // Set the report_status to '0' for testing
                    .expect(200);
    
                expect(response.body).toBeDefined();
                // Add further assertions based on the response data
            } catch (error) {
                console.error('Error while updating report status with valid input:', error);
                throw new Error('Failed to update report status with valid input');
            }
        });
    
        it('returns error for missing report_status field', async () => {
            try {
                const response = await request(serverURL)
                    .patch('/admin/updatereportstatus/123') // Replace '123' with valid report ID
                    .set('Authorization', `Bearer ${authToken}`)
                    .send({}) // Missing report_status field
                    .expect(400);
    
                expect(response.body).toBeDefined();
                // Add further assertions based on the response data
            } catch (error) {
                console.error('Error while updating report status with missing report_status field:', error);
                throw new Error('Failed to update report status with missing report_status field');
            }
        });
    });
    
    describe('Add Subject', () => {
        it('adds a new subject with valid input', async () => {
            try {
                const response = await request(serverURL)
                    .post('/admin/subject/addsubject')
                    .set('Authorization', `Bearer ${authToken}`)
                    .send({
                        subject_name: 'Math',
                        subject_code: 'ST212224236',
                        user_id: '1'
                    })
                    .expect(201);
    
                expect(response.body).toBeDefined();
                // Add further assertions based on the response data
            } catch (error) {
                console.error('Error while adding a new subject with valid input:', error);
                throw new Error('Failed to add a new subject with valid input');
            }
        });
    
        it('returns error for missing fields', async () => {
            try {
                const response = await request(serverURL)
                    .post('/admin/subject/addsubject')
                    .set('Authorization', `Bearer ${authToken}`)
                    .send({})
                    .expect(400);
    
                expect(response.body).toBeDefined();
                // Add further assertions based on the response data
            } catch (error) {
                console.error('Error while adding a new subject with missing fields:', error);
                throw new Error('Failed to add a new subject with missing fields');
            }
        });
    
        it('returns error if subject with the same code already exists', async () => {
            try {
                const response = await request(serverURL)
                    .post('/admin/subject/addsubject')
                    .set('Authorization', `Bearer ${authToken}`)
                    .send({
                        subject_name: 'Math',
                        subject_code: 'ST212224236', // Assuming this code already exists in the database
                        user_id: '1'
                    })
                    .expect(400);
    
                expect(response.body).toBeDefined();
                // Add further assertions based on the response data
            } catch (error) {
                console.error('Error while adding a new subject with existing code:', error);
                throw new Error('Failed to add a new subject with existing code');
            }
        });
    });

    describe('Get All Subjects', () => {
        it('gets all subjects with valid pagination', async () => {
            try {
                const response = await request(serverURL)
                    .get('/admin/subject/getallsubject?page=1&pageSize=10')
                    .set('Authorization', `Bearer ${authToken}`)
                    .expect(200);
    
                expect(response.body).toBeDefined();
                // Add further assertions based on the response data
            } catch (error) {
                console.error('Error while getting all subjects:', error);
                throw new Error('Failed to get all subjects');
            }
        });
    
        it('returns error with invalid pagination', async () => {
            try {
                const response = await request(serverURL)
                    .get('/admin/subject/getallsubject?page=-1&pageSize=0')
                    .set('Authorization', `Bearer ${authToken}`)
                    .expect(400);
    
                expect(response.body).toBeDefined();
                // Add further assertions based on the response data
            } catch (error) {
                console.error('Error while getting all subjects with invalid pagination:', error);
                throw new Error('Failed to get all subjects with invalid pagination');
            }
        });
        it('gets subject by id', async () => {
            try {
                const response = await request(serverURL)
                    .get('/admin/subject/getbyid/1')
                    .set('Authorization', `Bearer ${authToken}`)
                    .expect(200);

                expect(response.body).toBeDefined();
                // Add further assertions based on the response data
            } catch (error) {
                console.error('Error while listing subject:', error);
                throw new Error('Failed to list subject');
            }
        });
    });    

    describe('Delete Subject', () => {
        it('deletes Subject successfully', async () => {
            try {
                const response = await request(serverURL)
                    .delete('/admin/subject/deletesubject/32') // Put the Subject_id to delete
                    .set('Authorization', `Bearer ${authToken}`)
                    .expect(200);
    
                expect(response.body).toBeDefined();
                // Add further assertions based on the response data
            } catch (error) {
                console.error('Error while deleting Subject:', error);
                throw new Error('Failed to delete Subject');
            }
        });
    });
    
    describe('Update Subject', () => {
        it('updates subject information with valid inputs', async () => {
            try {
                const response = await request(serverURL)
                    .patch('/admin/subject/updatesubject/34') // Put number to edit
                    .set('Authorization', `Bearer ${authToken}`)
                    .send({
                        subject_id: "34",
                        subject_name: "TestForJest",
                        subject_code: "TFJ01",
                        user_id: "1"
                    })
                    .expect(200);

                expect(response.body).toBeDefined();
                // Add further assertions based on the response data
            } catch (error) {
                console.error('Error while updating user information:', error);
                throw new Error('Failed to update user information');
            }
        });
    });

    describe('Get room levels', () => {
        it('gets all room levels with valid pagination', async () => {
            try {
                const response = await request(serverURL)
                    .get('/admin/room/getroomlevel')
                    .set('Authorization', `Bearer ${authToken}`)
                    .expect(200);
    
                expect(response.body).toBeDefined();
                // Add further assertions based on the response data
            } catch (error) {
                console.error('Error while getting all room levels:', error);
                throw new Error('Failed to get all room levels');
            }
        });
    });

    // describe('Get room type', () => {
    //     it('gets all room type with valid pagination', async () => {
    //         try {
    //             const response = await request(app)
    //                 .get('/admin/room/getroomtype')
    //                 .set('Authorization', `Bearer ${authToken}`)
    //                 .expect(200);
    
    //             expect(response.body).toBeDefined();
    //             // Add further assertions based on the response data
    //         } catch (error) {
    //             console.error('Error while getting all room type:', error);
    //             throw new Error('Failed to get all room type');
    //         }
    //     });
    // });
    

    describe('Get teacherid', () => {
        it('gets all teacherid with valid pagination', async () => {
            try {
                const response = await request(serverURL)
                    .get('/admin/user/getteacherid')
                    .set('Authorization', `Bearer ${authToken}`)
                    .expect(200);
    
                expect(response.body).toBeDefined();
                // Add further assertions based on the response data
            } catch (error) {
                console.error('Error while getting all teacherid:', error);
                throw new Error('Failed to get all teacherid ');
            }
        });
    });
    describe('Get room number', () => {
        it('gets all room numbers for a specific room level', async () => {
            try {
                const response = await request(serverURL)
                    .get('/admin/room/getroomnumber/1') // ระบุ room_level ที่ต้องการทดสอบ
                    .set('Authorization', `Bearer ${authToken}`)
                    .expect(200);
    
                expect(response.body).toBeDefined();
            } catch (error) {
                console.error('Error while getting room numbers:', error);
                throw new Error('Failed to get room numbers');
            }
        });
    });

    describe('Get subjects list', () => {
        it('returns list of subjects successfully', async () => {
            try {
                const response = await request(serverURL)
                    .get('/admin/subject/getsubjectslist')
                    .set('Authorization', `Bearer ${authToken}`)
                    .expect(200);
    
                expect(response.body).toBeDefined();
            } catch (error) {
                console.error('Error while getting subjects list:', error);
                throw new Error('Failed to get subjects list');
            }
        });
    });

    describe('Add facility', () => {
        it('adds a new facility with valid format', async () => {
            const response = await request(serverURL)
                .post('/admin/facility/addfacility')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    facility_name: 'Test',
                    facility_id: '6'
                })
                .expect(201);
    
            expect(response.body).toBeDefined();
            expect(response.body.facility_id).toBeDefined();
        });
    
        it('adds a new facility with invalid format', async () => {
            const response = await request(serverURL)
                .post('/admin/facility/addfacility')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    facility_name: '', // Invalid format: empty facility name
                    facility_id: 'FAC002'
                })
                .expect(400);
    
            expect(response.body).toBeDefined();
            expect(response.body.facility_id).toBeUndefined();
        });
    });
    
    describe('Get All Subjects', () => {
        it('gets all subjects with valid pagination', async () => {
            try {
                const response = await request(serverURL)
                    .get('/admin/subject/getallsubject?page=1&pageSize=10')
                    .set('Authorization', `Bearer ${authToken}`)
                    .expect(200);
    
                expect(response.body).toBeDefined();
                // Add further assertions based on the response data
            } catch (error) {
                console.error('Error while getting all subjects:', error);
                throw new Error('Failed to get all subjects');
            }
        });
    
        it('returns error with invalid pagination', async () => {
            try {
                const response = await request(serverURL)
                    .get('/admin/subject/getallsubject?page=-1&pageSize=0')
                    .set('Authorization', `Bearer ${authToken}`)
                    .expect(400);
    
                expect(response.body).toBeDefined();
                // Add further assertions based on the response data
            } catch (error) {
                console.error('Error while getting all subjects with invalid pagination:', error);
                throw new Error('Failed to get all subjects with invalid pagination');
            }
        });
        it('gets subject by id', async () => {
            try {
                const response = await request(serverURL)
                    .get('/admin/subject/getbyid/1')
                    .set('Authorization', `Bearer ${authToken}`)
                    .expect(200);

                expect(response.body).toBeDefined();
                // Add further assertions based on the response data
            } catch (error) {
                console.error('Error while listing subject:', error);
                throw new Error('Failed to list subject');
            }
        });
    });   

    describe('Delete facility', () => {
        it('deletes facility successfully', async () => {
            try {
                const response = await request(serverURL)
                    .delete('/admin/facility/deletefacilitybyid/6') // Put the facility_id to delete
                    .set('Authorization', `Bearer ${authToken}`)
                    .expect(200);
    
                expect(response.body).toBeDefined();
                // Add further assertions based on the response data
            } catch (error) {
                console.error('Error while deleting facility:', error);
                throw new Error('Failed to delete facility');
            }
        });
    });

    describe('Update facility', () => {
        it('updates facility information with valid inputs', async () => {
            try {
                const response = await request(serverURL)
                    .patch('/admin/facility/updatefacility/97') // Put number to edit
                    .set('Authorization', `Bearer ${authToken}`)
                    .send({
                        facility_id: '1',
                        facility_name: 'Computer set'
                    })
                    
                    .expect(200);

                expect(response.body).toBeDefined();
                // Add further assertions based on the response data
            } catch (error) {
                console.error('Error while updating facility information:', error);
                throw new Error('Failed to update facility information');
            }
        });
    });
    
    describe('Get Class Schedule', () => {
        it('gets class schedule for rooms', async () => {
            try {
                const response = await request(serverURL)
                    .get('/class/getClassSchedule')
                    .set('Authorization', `Bearer ${authToken}`)
                    .expect(200);
    
                expect(response.body).toBeDefined();
                // Add further assertions based on the response data
            } catch (error) {
                console.error('Error while getting class schedule:', error);
                throw new Error('Failed to get class schedule');
            }
        });
    });

    describe('Add Class', () => {
        it('adds a new class with valid format', async () => {
            const response = await request(serverURL)
                .post('/class/addclass')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    subject_id: '999',
                    day_of_week: 'Monday',
                    start_time: '08:00',
                    end_time: '09:00',
                    room_id: '9999'
                })
                .expect(201);
    
            expect(response.body).toBeDefined();
            expect(response.body.class_id).toBeDefined();
        });
    
        it('adds a new class with invalid format', async () => {
            const response = await request(serverURL)
                .post('/class/addclass')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    subject_id: '', // Invalid format: empty subject_id
                    day_of_week: 'Monday',
                    start_time: '08:00',
                    end_time: '09:00',
                    room_id: '1'
                })
                .expect(500);
    
            expect(response.body).toBeDefined();
            expect(response.body.class_id).toBeUndefined();
        });
    });

    describe('Delete Class', () => {
        it('deletes class successfully', async () => {
            try {
                const response = await request(serverURL)
                    .delete('/class/deleteclass/179') // Put the class_id to delete
                    .set('Authorization', `Bearer ${authToken}`)
                    .expect(200);
    
                expect(response.body).toBeDefined();
                // Add further assertions based on the response data
            } catch (error) {
                console.error('Error while deleting class:', error);
                throw new Error('Failed to delete class');
            }
        });
    });    

    describe('Update Class', () => {
        it('updates class information with valid inputs', async () => {
            try {
                const response = await request(serverURL)
                    .patch('/class/updateclass/106') // Put number to edit
                    .set('Authorization', `Bearer ${authToken}`)
                    .send({
                        subject_id: '16',
                        day_of_week: 'Monday',
                        start_time: '08:00',
                        end_time: '09:00',
                    })
                    .expect(200);
    
                expect(response.body).toBeDefined();
                // Add further assertions based on the response data
            } catch (error) {
                console.error('Error while updating class information:', error);
                throw new Error('Failed to update class information');
            }
        });
    });
    
    describe('List all reserved data', () => {
        it('gets all reserved data', async () => {
            try {
                const response = await request(serverURL)
                    .get('/dashboard/getreserveddata')
                    .set('Authorization', `Bearer ${authToken}`)
                    .expect(200);
    
                expect(response.body).toBeDefined();
                // Add further assertions based on the response data
            } catch (error) {
                console.error('Error while listing reserved data:', error);
                throw new Error('Failed to list reserved data');
            }
        });
    });
    
    describe('List all DAU data', () => {
        it('gets all DAU data', async () => {
            try {
                const response = await request(serverURL)
                    .get('/dashboard/getdaudata')
                    .set('Authorization', `Bearer ${authToken}`)
                    .expect(200);
    
                expect(response.body).toBeDefined();
                // Add further assertions based on the response data
            } catch (error) {
                console.error('Error while listing DAU data:', error);
                throw new Error('Failed to list DAU data');
            }
        });
    });
    
    describe('List all report data', () => {
        it('gets all report data', async () => {
            try {
                const response = await request(serverURL)
                    .get('/dashboard/getreportdata')
                    .set('Authorization', `Bearer ${authToken}`)
                    .expect(200);
    
                expect(response.body).toBeDefined();
                // Add further assertions based on the response data
            } catch (error) {
                console.error('Error while listing report data:', error);
                throw new Error('Failed to list report data');
            }
        });
    });
    
    describe('Get Room Schedule', () => {
        it('gets room schedule for a specific user', async () => {
            try {
                const response = await request(serverURL)
                    .get('/reservation/getroomschedule')
                    .query({ room_id: '123', weeks: '2' }) // Provide appropriate room_id and weeks
                    .set('Authorization', `Bearer ${authToken}`)
                    .expect(200);
    
                expect(response.body).toBeDefined();
                // Add further assertions based on the response data
            } catch (error) {
                console.error('Error while getting room schedule:', error);
                throw new Error('Failed to get room schedule');
            }
        });
    });
    
    describe('Search Room', () => {
        beforeAll(async () => {
            try {
                const loginResponse = await request(serverURL)
                    .post('/auth/login')
                    .send({ pin: '1', citizen_id: '1' });
    
                if (loginResponse.status === 200) {
                    authToken = loginResponse.body.token;
                } else {
                    throw new Error('Login failed');
                }
            } catch (error) {
                console.error('Error during login:', error);
                throw new Error('Login failed');
            }
        });
    
        it('searches for rooms with valid search term', async () => {
            const response = await request(serverURL)
                .post('/reservation/searchroom')
                .set('Authorization', `Bearer ${authToken}`)
                .send({ room_capacity: '30', room_level: '9', room_type: 'ห้องปฏิบัติการ', room_number: '9901', reservation_date: '2024-01-22', start_time: '08:00:00', end_time: '09:00:00' })
                .expect(200);
    
            expect(response.body).toBeDefined();
            // Add further assertions based on the response data
        });
    });

    describe('Create Room Reservation', () => {
        it('creates a new room reservation with valid information', async () => {
            const response = await request(serverURL)
                .post('/reservation/reserve')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    room_id: '9',
                    reservation_date: '2024-02-18',
                    start_time: '08:00',
                    end_time: '09:00',
                    reservation_reason: 'TEST'
                })
                .expect(200);
    
            expect(response.body).toBeDefined();
            // Add further assertions based on the response data
        });
    });
    
    describe('Get All Reservations', () => {
        it('gets all reservations with valid pagination', async () => {
            try {
                const response = await request(serverURL)
                    .get('/reservation/getreservation?page=1&pageSize=10')
                    .set('Authorization', `Bearer ${authToken}`)
                    .expect(200);
    
                expect(response.body).toBeDefined();
                // Add further assertions based on the response data
            } catch (error) {
                console.error('Error while getting all reservations:', error);
                throw new Error('Failed to get all reservations');
            }
        });
    
        it('returns error with invalid pagination', async () => {
            try {
                const response = await request(serverURL)
                    .get('/reservation/getreservation?page=-1&pageSize=0')
                    .set('Authorization', `Bearer ${authToken}`)
                    .expect(400);
    
                expect(response.body).toBeDefined();
                // Add further assertions based on the response data
            } catch (error) {
                console.error('Error while getting all reservations with invalid pagination:', error);
                throw new Error('Failed to get all reservations with invalid pagination');
            }
        });
    });

    describe('Update Reservation Status', () => {
        it('updates reservation status successfully', async () => {
            try {
                // Assuming reservation_id and reservation_status are valid
                const response = await request(serverURL)
                    .patch('/reservation/updatestatus')
                    .set('Authorization', `Bearer ${authToken}`)
                    .query({ reservation_id: '67', reservation_status: '0' })
                    .expect(200);
    
                expect(response.body).toBeDefined();
                // Add further assertions based on the response data
            } catch (error) {
                console.error('Error while updating reservation status:', error);
                throw new Error('Failed to update reservation status');
            }
        });
    });

    describe('Get User Profile', () => {
        it('retrieves user profile successfully', async () => {
            try {
                const response = await request(serverURL)
                    .get('/user/getprofile')
                    .set('Authorization', `Bearer ${authToken}`)
                    .expect(200);
    
                expect(response.body).toBeDefined();
                // Add further assertions based on the response data
            } catch (error) {
                console.error('Error while retrieving user profile:', error);
                throw new Error('Failed to retrieve user profile');
            }
        });
    
        it('returns 401 if not authenticated', async () => {
            try {
                const response = await request(serverURL)
                    .get('/user/getprofile')
                    .expect(401);
    
                expect(response.body).toBeDefined();
                // Add further assertions based on the response data
            } catch (error) {
                console.error('Error while retrieving user profile:', error);
                throw new Error('Failed to retrieve user profile');
            }
        });
    });

    describe('Get User Reservations', () => {
        it('retrieves user reservations successfully', async () => {
            try {
                const response = await request(serverURL)
                    .get('/user/getreservation')
                    .set('Authorization', `Bearer ${authToken}`)
                    .expect(200);
    
                expect(response.body).toBeDefined();
                // Add further assertions based on the response data
            } catch (error) {
                console.error('Error while retrieving user reservations:', error);
                throw new Error('Failed to retrieve user reservations');
            }
        });
    
        it('returns 401 if not authenticated', async () => {
            try {
                const response = await request(serverURL)
                    .get('/user/getreservation')
                    .expect(401);
    
                expect(response.body).toBeDefined();
                // Add further assertions based on the response data
            } catch (error) {
                console.error('Error while retrieving user reservations:', error);
                throw new Error('Failed to retrieve user reservations');
            }
        });
    });
    
    describe('User Room Report', () => {
        it('creates a new room report successfully', async () => {
            try {
                const response = await request(serverURL)
                    .post('/user/room/report')
                    .set('Authorization', `Bearer ${authToken}`)
                    .send({
                        room_id: '1',
                        report_detail: 'ห้องนี้มีขยะที่พื้น'
                    })
                    .expect(200);
    
                expect(response.body).toBeDefined();
                // Add further assertions based on the response data
            } catch (error) {
                console.error('Error while creating room report:', error);
                throw new Error('Failed to create room report');
            }
        });
    
        it('returns 401 if not authenticated', async () => {
            try {
                const response = await request(serverURL)
                    .post('/user/room/report')
                    .send({
                        report_detail: 'ห้องนี้มีขยะที่พื้น'
                    })
                    .expect(401);
    
                expect(response.body).toBeDefined();
                // Add further assertions based on the response data
            } catch (error) {
                console.error('Error while creating room report:', error);
                throw new Error('Failed to create room report');
            }
        });
    
        it('returns 400 if room_id is missing', async () => {
            try {
                const response = await request(serverURL)
                    .post('/user/room/report')
                    .set('Authorization', `Bearer ${authToken}`)
                    .send({
                        report_detail: 'ห้องนี้มีขยะที่พื้น'
                    })
                    .expect(400);
    
                expect(response.body).toBeDefined();
                // Add further assertions based on the response data
            } catch (error) {
                console.error('Error while creating room report:', error);
                throw new Error('Failed to create room report');
            }
        });
    });
    
    describe('Get User Report', () => {
        it('retrieves user report successfully', async () => {
            try {
                const response = await request(serverURL)
                    .get('/user/getreport')
                    .set('Authorization', `Bearer ${authToken}`)
                    .expect(200);
    
                expect(response.body).toBeDefined();
                // Add further assertions based on the response data
            } catch (error) {
                console.error('Error while retrieving user report:', error);
                throw new Error('Failed to retrieve user report');
            }
        });
    
        it('returns 401 if not authenticated', async () => {
            try {
                const response = await request(serverURL)
                    .get('/user/getreport')
                    .expect(401);
    
                expect(response.body).toBeDefined();
                // Add further assertions based on the response data
            } catch (error) {
                console.error('Error while retrieving user report:', error);
                throw new Error('Failed to retrieve user report');
            }
        });
    });

    describe('Get Class Schedule', () => {
        it('returns class schedule for teacher successfully', async () => {
            try {
                const response = await request(serverURL)
                    .get('/user/getschedule')
                    .set('Authorization', `Bearer ${authToken}`)
                    .expect(200);
    
                expect(response.body).toBeDefined();
                // Add further assertions based on the response data
            } catch (error) {
                console.error('Error while getting class schedule for teacher:', error);
                throw new Error('Failed to get class schedule for teacher');
            }
        });
    
        it('returns 401 if not authenticated', async () => {
            try {
                const response = await request(serverURL)
                    .get('/user/getschedule')
                    .expect(401);
    
                expect(response.body).toBeDefined();
                // Add further assertions based on the response data
            } catch (error) {
                console.error('Error while getting class schedule for teacher:', error);
                throw new Error('Failed to get class schedule for teacher');
            }
        });
    });
    
    
});