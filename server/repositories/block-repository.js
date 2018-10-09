'use strict';

import BaseRepository from './base-repository';
import {Block} from '../models'

export default class BlockRepository extends BaseRepository {

	constructor() {
		super(Block);
	}

}
