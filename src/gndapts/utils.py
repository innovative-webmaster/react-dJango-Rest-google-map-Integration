import json
from uuid import UUID


def NewJSONEncoder(self, o):
    if isinstance(o, UUID):
        return str(o)
    return json.JSONEncoder(self, o)
