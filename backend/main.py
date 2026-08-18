import sys
import os

sys.path.insert(
    0,
    os.path.dirname(os.path.abspath(__file__))
)

from launcher.launcher import Launcher


def main():

    try:

        launcher = Launcher()
        launcher.run()

    except Exception as e:

        print(f"❌ Erro fatal: {e}")

        import traceback
        traceback.print_exc()

        sys.exit(1)


if __name__ == "__main__":
    main()