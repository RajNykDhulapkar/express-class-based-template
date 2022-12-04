import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import UserService from "src/modules/user/services/user.service";
import { IUserService } from "src/modules/user/user.service";
import { Repository } from "typeorm";
import Session from "../entities/session.entity";
import { SessionModelMongoose as SessionModel } from "../session.model";

@Injectable()
export default class SessionService {
    public sessionModel: SessionModel;
    private readonly userService: IUserService;

    constructor(
        private readonly _sessionModel: SessionModel,
        private readonly _userService: IUserService,
    ) {
        this.sessionModel = _sessionModel;
        this.userService = _userService;
    }

    public async createSession(userId: number): Promise<Session> {
        // user validity check will be down using guards
        const user = await this.userService.getById(userId);
        if (user) {
            const session = this.sessionRepository.create({ user });
            return this.sessionRepository.save(session);
        } else {
            throw new NotFoundException(`user with the userId ${userId} not found`);
        }
    }
    public findSessionById(sessionId: number): Promise<Session> {
        return this.sessionRepository.findOne(sessionId, {
            relations: ["user"],
        });
    }
    public async invalidateRefreshToken(sessionId: number): Promise<Session> {
        const session = await this.sessionRepository.findOne(sessionId);
        if (session) session.valid = false;
        return this.sessionRepository.save(session);
    }
}
