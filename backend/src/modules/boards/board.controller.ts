import { asyncHandler } from "../../utils/asyncHandler";
import { BOARD_FIELDS, type BoardInput } from "./board.types";
import * as boardService from "./board.service";
import { pick } from "../../utils/pick";

export const list = asyncHandler(async (req, res) => {
  res.json(await boardService.listBoards(req.user!.id));
});

export const create = asyncHandler(async (req, res) => {
  const input = pick<BoardInput>(req.body, BOARD_FIELDS);
  const board = await boardService.createBoard(req.user!.id, input);
  res.status(201).json(board);
});

export const getOne = asyncHandler(async (req, res) => {
  res.json(await boardService.getBoard(req.params.boardId, req.user!.id));
});

export const update = asyncHandler(async (req, res) => {
  const input = pick<BoardInput>(req.body, BOARD_FIELDS);
  const board = await boardService.updateBoard(
    req.params.boardId,
    req.user!.id,
    input,
  );
  res.json(board);
});

export const remove = asyncHandler(async (req, res) => {
  await boardService.deleteBoard(req.params.boardId, req.user!.id);
  res.status(204).send();
});

export const addMember = asyncHandler(async (req, res) => {
  const board = await boardService.addMember(
    req.params.boardId,
    req.user!.id,
    req.body?.email,
  );
  res.status(201).json(board);
});

export const removeMember = asyncHandler(async (req, res) => {
  const board = await boardService.removeMember(
    req.params.boardId,
    req.user!.id,
    req.params.userId,
  );
  res.json(board);
});
