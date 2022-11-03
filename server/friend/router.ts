import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import FriendCollection from '../friend/collection';
import * as userValidator from '../user/middleware';
import * as friendValidator from '../friend/middleware';
import * as util from './util';
import {constructUserResponse, UserResponse} from '../user/util';
import UserCollection from '../user/collection';

const router = express.Router();

/**
 * Get a user's friends.
 *
 * @name GET /api/friends?userId=id
 *
 * @return {FriendResponse} - The friends of a user
 * @throws {400} - If userId is not given
 * @throws {404} - If no user has given userId
 *
 */
router.get(
  '/',
  async (req: Request, res: Response, next: NextFunction) => {
    // Check if user query parameter was supplied
    if (req.query.user !== undefined) {
      next();
      return;
    }

    const allFriends = await FriendCollection.findAll();
    const response = allFriends.map(util.constructFriendResponse);
    res.status(200).json(response);
  },
  [
    userValidator.isUserLoggedIn,
    userValidator.isUserExists
  ],
  async (req: Request, res: Response) => {
    const userFriends = await FriendCollection.findAllByUsername(req.query.user as string);
    const response = [];
    if (userFriends.length !== 0) {
      const {friends} = userFriends[0];
      for (const friend of friends) {
        const user = await UserCollection.findOneByUserId(friend)
        response.push(constructUserResponse(user));
      }
    }

    res.status(200).json(response);
  }
);

/**
 * Get the mutual friends of a user
 *
 * @name GET /api/friends/mutual:user?
 *
 * @param {string} user - the user you want to see your mutual friends with
 * @return {Types.ObjectId[]} - The mutual friends
 * @throws {403} - If the user is not logged in
 * @throws {404} - If the user is not valid
 */
router.get(
  '/mutual:user?',
  [
    userValidator.isUserLoggedIn,
    userValidator.isUserExists
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const mutuals = await FriendCollection.findMutualFriends(userId, req.query.user as string);
    const all = mutuals.map(mutual => constructUserResponse(mutual));
    res.status(201).json(all);
  }
);

/**
 * Get the suggested friends of a user
 *
 * @name GET /api/friends/suggested:user?
 *
 * @param {string} user - the user you want to see your mutual friends with
 * @return {Types.ObjectId[]} - The suggested friends
 * @throws {403} - If the user is not logged in
 * @throws {404} - If the user is not valid
 */
router.get(
  '/suggested:user?',
  [
    userValidator.isUserLoggedIn,
    userValidator.isUserExists
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const suggested = await FriendCollection.findSuggestedFriends(userId, req.query.user as string);
    const all = suggested.map(suggest => constructUserResponse(suggest));
    res.status(201).json(all);
  }
);

/**
 * Create a new friend
 *
 * @name POST /api/friends
 *
 * @param {string} user - The root user
 * @param {string} recipient - the user you want to add as a friend
 * @return {FriendResponse} - The created friend
 * @throws {403} - If the user is not logged in
 * @throws {400} - If the recipient id is empty
 * @throws {404} - If the recipient id is invalid
 * @throws {409} - If the user is already friends with recipient
 */
router.post(
  '/',
  [
    userValidator.isUserLoggedIn,
    userValidator.isUserRecipientExists,
    friendValidator.isAlreadyFriends
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const friend = await FriendCollection.updateOne(userId, req.body.recipient, 'add');
    res.status(201).json({
      message: 'Your are now friends!',
      friend: util.constructFriendResponse(friend)
    });
  }
);

/**
 * Remove a new friend
 *
 * @name Delete /api/friends
 *
 * @param {string} user - The root user
 * @param {string} recipient - the user you want to remove as a friend
 * @return {FriendResponse} - The updated friend
 * @throws {403} - If the user is not logged in
 */
router.delete(
  '/',
  [
    userValidator.isUserLoggedIn,
    userValidator.isUserRecipientExists
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const friend = await FriendCollection.updateOne(userId, req.body.recipient, 'remove');
    res.status(201).json({
      message: 'Your are no longer friends!',
      friend: util.constructFriendResponse(friend)
    });
  }
);

export {router as friendRouter};
