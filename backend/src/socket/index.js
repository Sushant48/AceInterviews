import { Server } from "socket.io";
import { Interview } from "../models/interview.model.js";
import { ApiError } from "../utils/ApiError.js";

const setupInterviewSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.CORS_ORIGIN,
      methods: ["GET", "POST"]
    },
  });

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('joinInterview', ({ interviewId, userId }) => {
        socket.join(interviewId);
        console.log(`User ${userId} joined interview ${interviewId}`);

        // Send interview starting soon notification
        setTimeout(() => {
            io.to(interviewId).emit('interviewStartingSoon', { message: 'Your interview is starting soon!' });
        }, 300000); // 5 minutes before
    });

    socket.on('sendAnswer', async ({ interviewId, questionId, answer }) => {
        try {
            const interview = await Interview.findById(interviewId);
            if (!interview) throw new ApiError(403,'Interview not found');

            const question = interview.questions.id(questionId);
            if (!question) throw new ApiError(404,'Question not found');

            question.userAnswer = answer;
            await interview.save();

            io.to(interviewId).emit('receiveAnswer', { questionId, answer });

             io.to(interviewId).emit('liveFeedback', { message: 'Good answer! Keep it up!' });
        } catch (error) {
            console.error(error);
            socket.emit('error', { message: error.message });
        }
    });

    socket.on('requestNextQuestion', ({ interviewId, questionIndex }) => {
        io.to(interviewId).emit('nextQuestion', { questionIndex });
    });

    socket.on('completeInterview', async ({ interviewId }) => {
        try {
            const interview = await Interview.findById(interviewId);
            if (!interview) throw new ApiError(404 , 'Interview not found');

            interview.status = 'completed';
            await interview.save();

            io.to(interviewId).emit('interviewCompleted');

             // Send final completion status update
             io.to(interviewId).emit('completionNotification', { message: 'Interview completed successfully!' });
        } catch (error) {
            console.error(error);
            socket.emit('error', { message: error.message });
        }
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});
};

export { setupInterviewSocket };
