export const EVENT = {
    inactive: 'inactive',
    error: 'error',
    usersChange: 'usersChange',
    saving: 'saving',
    saved: 'saved',
    published: 'published',
    reverted: 'reverted',
    broadcast: 'broadcast',
    statusChange: 'statusChange',
};

export const ERROR_CODE = {
    INIT_FAILED: 'INIT_FAILED',
    SAVE_FAILED: 'SAVE_FAILED',
    PUBLISH_FAILED: 'PUBLISH_FAILED',
    DISCONNECTED: 'DISCONNECTED',
    STATUS_CODE: {
        TIMEOUT: 4001,
        FORCE_DISCONNECTED: 4002,
    },
    CONNECTION_ERROR: 'CONNECTION_ERROR',
    COLLAB_DOC_ERROR: 'COLLAB_DOC_ERROR',
};

export const ERROR_LEVEL = {
    FATAL: 'FATAL',
    WARNING: 'WARNING',
    NOTICE: 'NOTICE',
};

export const STATUS = {
    initialize: 'initialize',
    docLoaded: 'docLoaded',
    active: 'active',
    exit: 'exit',
    error: 'error',
    deleted: 'deleted',
};

export const MESSAGE = {
    DOC_PUBLISHED: 'DOC_PUBLISHED',
    DOC_DELETED: 'DOC_DELETED',
};
