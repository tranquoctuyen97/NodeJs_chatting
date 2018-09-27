'use strict';

export default class BaseRepository {
    constructor (model) {
        this._model = model;
    }
    async getAll (options){
        const newOptions = {
            limit: 1000,
            ...options
        };
        return await this._model.findAll(newOptions);
    }
    async getOne (options) {
        return await this._model.findOne(options);
    }
    async create (data) {
        return this._model.create(data);
    }
    async bulkCreate(data, options) {
        return this._model.bulkCreate(data, options);
    }
    async update (data, options) {
        const newOptions = {
            returning: true,
            ...options
        };
        const update = await this._model.update(data, newOptions);
        if (update[0] === 0) {
            return Promise.reject(new Error('Error update'));
        }
        return update[1];
    }
    async delete (options) {
        return await this._model.destroy(options);
    }

}