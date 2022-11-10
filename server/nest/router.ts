import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import NestCollection from '../nest/collection';
import FreetCollection from '../freet/collection';
import UserCollection from '../user/collection';
import TimeCollection from '../time/collection';
import * as userValidator from '../user/middleware';
import * as nestValidator from '../nest/middleware';
import * as freetValidator from '../freet/middleware';
import * as util from './util';
import {constructUserResponse} from '../user/util';
import {constructFreetResponse} from '../freet/util';

const router = express.Router();

/**
 * Get nests by creator.
 *
 * @name GET /api/nests?creatorId=id
 *
 * @return {NestResponse[]} - An array of nests created by user with id, creatorId
 * @throws {400} - If creatorId is not given
 * @throws {404} - If no user has given creatorId
 * @throws {403} - If the user is trying to see someone else's nests
 *
 */
router.get(
  '/',
  async (req: Request, res: Response, next: NextFunction) => {
    // Check if creator query parameter was supplied
    if (req.query.creator !== undefined) {
      next();
      return;
    }

    const allNests = await NestCollection.findAll();
    const response = allNests.map(util.constructNestResponse);
    res.status(200).json(response);
  },
  [
    userValidator.isCreatorExists,
    nestValidator.isValidNestViewer
  ],
  async (req: Request, res: Response) => {
    const creatorNests = await NestCollection.findAllByUsername(req.query.creator as string);
    const response = creatorNests.map(util.constructNestResponse);
    res.status(200).json(response);
  }
);

/**
 * Get a nest's members.
 *
 * @name GET /api/nests/:nestId?/members
 *
 * @return {Types.ObjectId[]} - An array of the ids of the members in a nest
 * @throws {400} - If nestId is not given
 * @throws {403} - If the user is not logged in or is not the creator of
 *                 the nest
 * @throws {404} - If the nestId is not valid
 *
 */
router.get(
  '/:nestId?/members',
  async (req: Request, res: Response, next: NextFunction) => {
    // Check if nestId parameter was supplied
    if (req.params.nestId !== undefined) {
      next();
      return;
    }

    const allNests = await NestCollection.findAll();
    const response = allNests.map(util.constructNestResponse);
    res.status(200).json(response);
  },
  [
    userValidator.isUserLoggedIn,
    nestValidator.isNestExists,
    nestValidator.isValidNestMemberViewer
  ],
  async (req: Request, res: Response) => {
    const nest = await NestCollection.findOne(req.params.nestId);
    const response = [];
    for (const member of nest.members) {
      const user = await UserCollection.findOneByUserId(member);
      response.push(constructUserResponse(user));
    }

    res.status(200).json(response);
  }
);

/**
 * Get a nest's posts.
 *
 * @name GET /api/nests/:nestId?/posts
 *
 * @return {Types.ObjectId[]} - An array of the ids of the posts in a nest
 * @throws {403} - If the user is not logged in or is not the creator of
 *                 the nest or member of the nest
 * @throws {404} - If the nestId is not valid
 *
 */
router.get(
  '/:nestId?/posts',
  async (req: Request, res: Response, next: NextFunction) => {
    // Check if nestId parameter was supplied
    if (req.params.nestId !== undefined) {
      next();
      return;
    }

    const allNests = await NestCollection.findAll();
    const response = allNests.map(util.constructNestResponse);
    res.status(200).json(response);
  },
  [
    userValidator.isUserLoggedIn,
    nestValidator.isNestExists,
    nestValidator.isValidNestPostViewer
  ],
  async (req: Request, res: Response) => {
    const nest = await NestCollection.findOne(req.params.nestId);
    const response = [];
    const {posts} = nest;
    for (const post of posts) {
      const freet = await FreetCollection.findOne(post);
      response.push(constructFreetResponse(freet));
    }

    res.status(200).json(response);
  }
);

/**
 * Create a new nest.
 *
 * @name POST /api/nests
 *
 * @param {string} name - The name of the nest
 * @return {NestResponse} - The created nest
 * @throws {403} - If the user is not logged in
 * @throws {400} - If the nest name is empty or a stream of empty spaces
 * @throws {413} - If the nest name is more than 30 characters long
 */
router.post(
  '/',
  [
    userValidator.isUserLoggedIn,
    nestValidator.isValidNestName
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const nest = await NestCollection.addOne(userId, req.body.name, [], []);
    await TimeCollection.addOne(userId, nest._id, '00:00', '23:59'); // When you make a nest, you automatically create a time
    res.status(201).json({
      message: 'Your nest was created successfully.',
      nest: util.constructNestResponse(nest)
    });
  }
);

/**
 * Delete a nest
 *
 * @name DELETE /api/nests/:id
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in or is not the creator of
 *                 the nest
 * @throws {404} - If the nestId is not valid
 */
router.delete(
  '/:nestId?',
  [
    userValidator.isUserLoggedIn,
    nestValidator.isNestExists,
    nestValidator.isValidNestModifier
  ],
  async (req: Request, res: Response) => {
    const nests = await NestCollection.findAll();
    const nest = await NestCollection.findOne(req.params.nestId);

    const times = await TimeCollection.findAllByGroup(req.params.nestId);
    for (const time of times) {
      await TimeCollection.deleteOne(time._id);
    }

    await NestCollection.deleteOne(req.params.nestId);
    res.status(200).json({
      message: 'Your nest was deleted successfully.'
    });
  }
);

/**
 * Modify a nest's posts
 *
 * @name PUT /api/nests/:id/posts
 *
 * @param {string} freetId - the postId to add/remove
 * @param {string} operation - whether to add or remove
 * @return {NestResponse} - the updated nest
 * @throws {403} - if the user is not logged in or not the creator of
 *                 of the nest
 * @throws {404} - If the nest is not valid
 * @throws {404} - If the freetId is not valid
 */
router.put(
  '/:nestId?/posts',
  [
    userValidator.isUserLoggedIn,
    nestValidator.isNestExists,
    nestValidator.isValidNestModifier,
    freetValidator.isFreetValid
  ],
  async (req: Request, res: Response) => {
    const nest = await NestCollection.updateOne(req.params.nestId, undefined, req.body.freetId, req.body.operation);
    res.status(200).json({
      message: 'Your nest was updated successfully.',
      nest: util.constructNestResponse(nest)
    });
  }
);

/**
 * Modify a nest's members
 *
 * @name PUT /api/nests/:id/members
 *
 * @param {string} memberId - the memberId to add/remove
 * @param {string} operation - whether to add or remove
 * @return {NestResponse} - the updated nest
 * @throws {403} - if the user is not logged in or not the creator of
 *                 of the nest
 * @throws {404} - If the nest is not valid
 * @throws {404} - If the member is not valid
 */
router.put(
  '/:nestId?/members',
  [
    userValidator.isUserLoggedIn,
    userValidator.isUserValid2,
    nestValidator.isNestExists,
    nestValidator.isValidNestModifier
  ],
  async (req: Request, res: Response) => {
    const member = await UserCollection.findOneByUsername(req.body.memberId);
    const nest = await NestCollection.updateOne(req.params.nestId, member._id, undefined, req.body.operation);
    res.status(200).json({
      message: 'Your nest was updated successfully.',
      nest: util.constructNestResponse(nest)
    });
  }
);

export {router as nestRouter};
