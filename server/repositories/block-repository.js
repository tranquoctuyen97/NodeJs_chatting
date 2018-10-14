'use strict';

import BaseRepository from '../repositories/base-repository';
import {Group} from '../models/'

export default class BlockRepository extends BaseRepository {

    constructor() {
        super(Group);
    }

}
